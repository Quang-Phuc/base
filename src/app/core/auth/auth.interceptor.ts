import { HttpErrorResponse, HttpInterceptorFn, HttpEvent, HttpRequest, HttpHandlerFn, HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from './token-storage';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenStorage = inject(TokenStorage);
    const authService = inject(AuthService);
    const http = inject(HttpClient);

    const token = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    const isAuthRequest = req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh-token');

    let authReq = req;

    if (token && !isAuthRequest) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // ✅ BƯỚC 1: Nếu là 401, ta xử lý im lặng
            if (error.status === 401) {

                // Nếu có Refresh Token -> Đi cứu (Âm thầm)
                if (!isAuthRequest && refreshToken) {
                    console.log('%c🤫 [Silent Mode]: 401 Detected. Refreshing...', 'color: #6366f1');
                    return handle401Error(authReq, next, tokenStorage, authService, http);
                }

                // Nếu là API Auth tạch hoặc không có gì để cứu
                if (isAuthRequest) {
                    tokenStorage.clear();
                }

                // ✅ BƯỚC 2: QUAN TRỌNG NHẤT
                // Để "bịt miệng" các Interceptor báo lỗi khác (như cái bảng đỏ bồ thấy)
                // Ta gắn thêm flag 'x-skip-error-toast' vào headers của error hoặc ném ra object custom
                // Nhưng cách lầy nhất và hiệu quả nhất là ném ra một Error mà status đã bị đổi thành 0
                // hoặc kèm flag handled.
                return throwError(() => ({
                    ...error,
                    message: 'SILENT_ERROR', // Ghi đè chữ Unauthorized
                    handled: true
                }));
            }

            return throwError(() => error);
        })
    );
};

const handle401Error = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    tokenStorage: TokenStorage,
    authService: AuthService,
    http: HttpClient
): Observable<HttpEvent<any>> => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        const refreshToken = tokenStorage.getRefreshToken();

        return http.post<any>(`${environment.apiBaseUrl}/auth/refresh-token`, { refreshToken }).pipe(
            switchMap((res: any) => {
                isRefreshing = false;
                const newToken = res.data?.token || res.token;
                const newRefreshToken = res.data?.refreshToken || res.refreshToken;

                if (newToken) {
                    tokenStorage.saveAccessToken(newToken, true);
                    if (newRefreshToken) {
                        tokenStorage.saveRefreshToken(newRefreshToken, true);
                    }
                    authService.isLoggedIn.set(true);
                    refreshTokenSubject.next(newToken);

                    // Thực hiện lại request với token mới
                    return next(req.clone({
                        setHeaders: { Authorization: `Bearer ${newToken}` }
                    }));
                } else {
                    throw new Error('No token');
                }
            }),
            catchError((err) => {
                isRefreshing = false;
                tokenStorage.clear();
                authService.isLoggedIn.set(false);

                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                // Tắt nốt thông báo lỗi khi refresh tạch
                return throwError(() => ({ ...err, handled: true }));
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter(t => t !== null),
            take(1),
            switchMap(newToken => {
                return next(req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` }
                }));
            })
        );
    }
};