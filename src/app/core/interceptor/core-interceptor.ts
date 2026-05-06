import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, finalize, map, Observable, retry, throwError, timer } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';
import { LoadingStore } from '../../stores/loading.store';

const DELAY_TIME = 5000;
const MAX_RETRY = 3;
export const coreInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingStore = inject(LoadingStore);
    const localstorageService = inject(LocalstorageService);
    const authToken =
        localstorageService.getToken() ||
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaHVjLmxxQGFzZWFuc2MuY29tLnZuIiwiYXV0aCI6IlJPTEVfVVNFUiIsInNiX2siOiJmZjBmODIzNDE3ZDIwNDFiIiwic2JfZHQiOiJhNzljYmJmOGU5MWFhNDdhY2Y2ZDI4ODUzNGRmMmY2MjIyYmM2MjYxM2EyMTEyMjBlNzk3YmJiMGZjMDAxYWZiMTA4NmQxY2U2MTFhYTg5ODEzYTlkZGI4ZWYxZDkzOTRmZDI3YjA1MDI3YzI2NDQ4ZjI1MDljMDMzZjg3ZjdiY2JmMjk2ZWQyYTRmYTIyYTYwZmJjOWM1MTBlNmM0ZWZkNDMzYWQ5YWMxNjEyYWRhOGI5MGZjOTc3OTY5MDhhYmRmY2I4MmFlNjQ0YjA4NjMyNzUzODg5NzMyODJiYjVhZmVjMGEyM2U5NTQ0OTFhNjU4OWIxMzkzNTQ1NGU2MDBmNTQ5OTUxN2UyMDVmZDc5MjUwOGZmNjI1MjliOTFjZTI4MmZjMmFjZjVmZjc2YjlkNTI2YzRiOGFlZjFhMDJmNWJkMjdmZjA2NzgyZGFhM2RkNzBlZTU5ZjM2MzVmNTA1ZDlmNmIxZjE5NjExN2EyN2U4ZjY0Y2ZkNDNlMjc3NGY4YzE5OTg3ZjM3NTY3MjM3Y2E4OGViMmIyZjFlY2JkZWRhYzhiYTJiMzJiNWZiYWQ2MGQ2MGZjNWU3ZDc3YWQyMzU4N2QzNzdhNWZmZDUyYTY3ZDk3MzEzMTFiYTMxODk2M2U5NDJjNzI0YTgwNzg2YjY1YmRjNzVhZGJiYmNjMzM2ZmViY2U4OWYyYWI2NjM5NDAwZTQ3OTVlMzUwMmFlMTVhNjNmZWE2NzA2MDlhNTc4ZTdjOTg1M2UxYTRjMmNiNDJjYjE5MTA0YmRkMDc5YjdiZTRiZTcyMDUxNzQ0MSIsImV4cCI6MTc2ODU1MjQ5Nn0.M0J7_LD1t0sI_Ha4L3OEO47Z2YrfcEmHJ9wpc1qpcS8qHQAiwQ3EX1HFI3gYX7qpJvT3PxViZhMHF-HiKHXZ-Q';
    const router = inject(Router);
    const addToken = (request: HttpRequest<unknown>, token: string | null) => {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    };
    const isLoginRoute = !req.url.includes('process');
    if (authToken && !isLoginRoute) {
        req = addToken(req, authToken);
    }

    const retryWhen = (error: HttpErrorResponse): Observable<unknown> => {
        return error.status === 500 ? timer(DELAY_TIME) : throwError(() => error);
    };
    loadingStore.onLoading();
    return next(req).pipe(
        map((res) => {
            return res;
        }),
        retry({ count: MAX_RETRY, delay: retryWhen }),
        catchError((error) => {
            if (error instanceof HttpErrorResponse) {
                switch (error.status) {
                    case 401:
                        break;
                    default:
                        router.navigateByUrl('').then();
                        break;
                }
            }
            return throwError(() => error as HttpErrorResponse);
        }),
        finalize(() => loadingStore.offLoading()),
    );
};
