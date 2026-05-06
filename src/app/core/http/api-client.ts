// src/app/core/http/api-client.ts
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {TokenStorage} from "@core/token-storage";
import {ApiEnvelope, isApiFail, pickApiCode, pickApiMessage} from "@share/api-response.model";

export type ApiClientOptions = {
  silent?: boolean;           // không toast HTTP error (interceptor skip)
  successToast?: string;      // nếu muốn auto toast success
};

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(
      private http: HttpClient,
      private tokens: TokenStorage
  ) {}

  private buildParams(params?: any): HttpParams {
    let p = new HttpParams();
    if (!params) return p;

    Object.keys(params).forEach((k) => {
      const v = params[k];
      if (v !== null && v !== undefined) p = p.set(k, String(v));
    });

    return p;
  }

  /**
   * ✅ buildHeaders:
   * - gắn Authorization nếu có token
   * - gắn x-skip-error-toast nếu silent
   * ⚠️ multipart/form-data: KHÔNG set Content-Type tại đây
   */
  private buildHeaders(options?: ApiClientOptions): HttpHeaders | undefined {
    let headers = new HttpHeaders();

    if (options?.silent) headers = headers.set('x-skip-error-toast', '1');

    const token = this.tokens.getAccessToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * ✅ Hàm “chuẩn hoá”:
   * - Success envelope => trả về data
   * - Body error (result='error' hoặc {code,messages}) => throwError(...) để interceptor / component bắt
   */
  private unwrapData<T>(envelope: any): Observable<T> {
    if (isApiFail(envelope)) {
      return throwError(() => ({ error: envelope }));
    }

    if (envelope?.result === 'success') {
      return new Observable<T>((sub) => {
        sub.next(envelope.data as T);
        sub.complete();
      });
    }

    if (envelope?.result === 'error') {
      const normalized = {
        code: pickApiCode(envelope),
        messages: envelope?.messages,
        message: pickApiMessage(envelope),
        raw: envelope,
      };
      return throwError(() => ({ error: normalized }));
    }

    return throwError(() => ({
      error: { message: 'Sai định dạng response', raw: envelope }
    }));
  }

  // ============================================================
  // ✅ JSON APIs (GET/POST/PUT/DELETE) - unwrap envelope
  // ============================================================

  getData<T>(endpoint: string, params?: any, options?: ApiClientOptions): Observable<T> {
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders(options);

    return this.http
        .get<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams, headers })
        .pipe(
            map((envelope) => envelope as any),
            catchError((err) => throwError(() => err)),
        )
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  postData<T>(endpoint: string, body: any = {}, options?: ApiClientOptions): Observable<T> {
    const headers = this.buildHeaders(options);

    return this.http
        .post<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, body, { headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  // ============================================================
  // ✅ NEW: POST FOR BLOB (Dùng cho Export Excel)
  // ============================================================

  /**
   * ✅ POST nhận về Blob (thường dùng cho Export có gửi kèm filter body)
   */
  postDataForBlob(endpoint: string, body: any = {}, options?: ApiClientOptions): Observable<Blob> {
    const headers = this.buildHeaders(options);

    return this.http.post(`${this.baseUrl}/${endpoint}`, body, {
      headers,
      responseType: 'blob'
    });
  }

  /**
   * ✅ GET nhận về Blob (dùng cho tải file mẫu)
   */
  getDataForBlob(endpoint: string, params?: any, options?: ApiClientOptions): Observable<Blob> {
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders(options);

    // Thêm 'as Observable<Blob>' để báo cho TS biết mình đang nhận Blob
    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
      headers,
      responseType: 'blob'
    }) as Observable<Blob>;
  }
  putData<T>(endpoint: string, body: any, options?: ApiClientOptions): Observable<T> {
    const headers = this.buildHeaders(options);

    return this.http
        .put<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, body, { headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  deleteData<T>(endpoint: string, params?: any, options?: ApiClientOptions): Observable<T> {
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders(options);

    return this.http
        .delete<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, { params: httpParams, headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  // ============================================================
  // ✅ MULTIPART FORM-DATA APIs
  // ============================================================

  postMultipart<T>(endpoint: string, formData: FormData, options?: ApiClientOptions): Observable<T> {
    const headers = this.buildHeaders(options);

    return this.http
        .post<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, formData, { headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  putMultipart<T>(endpoint: string, formData: FormData, options?: ApiClientOptions): Observable<T> {
    const headers = this.buildHeaders(options);

    return this.http
        .put<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, formData, { headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  patchMultipart<T>(endpoint: string, formData: FormData, options?: ApiClientOptions): Observable<T> {
    const headers = this.buildHeaders(options);

    return this.http
        .patch<ApiEnvelope<T>>(`${this.baseUrl}/${endpoint}`, formData, { headers })
        .pipe((source) =>
            new Observable<T>((sub) => {
              const s = source.subscribe({
                next: (env) => {
                  this.unwrapData<T>(env).subscribe({
                    next: (data) => {
                      sub.next(data);
                      sub.complete();
                    },
                    error: (e) => sub.error(e),
                  });
                },
                error: (e) => sub.error(e),
              });
              return () => s.unsubscribe();
            })
        );
  }

  // ============================================================
  // ✅ NEW: DOWNLOAD FILE (BLOB) APIs
  // ============================================================

  /**
   * ✅ GET blob + full response (headers included)
   * - dùng để download file/attachment dạng byte[] từ backend
   */
  getBlobWithResponse(
      endpoint: string,
      params?: any,
      options?: ApiClientOptions
  ): Observable<HttpResponse<Blob>> {
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders(options);

    return (this.http.get(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
      headers,
      observe: 'response',
      responseType: 'blob',
    }) as Observable<HttpResponse<Blob>>).pipe(
        catchError((err) => throwError(() => err))
    );
  }

  /**
   * ✅ GET blob only (không cần headers)
   * - dùng cho preview ảnh/pdf
   */
  getBlob(
      endpoint: string,
      params?: any,
      options?: ApiClientOptions
  ): Observable<Blob> {
    const httpParams = this.buildParams(params);
    const headers = this.buildHeaders(options);

    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      params: httpParams,
      headers,
      responseType: 'blob',
    }) as Observable<Blob>;
  }
}
