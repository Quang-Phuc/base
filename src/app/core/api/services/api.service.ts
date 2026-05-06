import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DynamicDialogService } from '@share/dynamic-dialog.service';
import { ToastService } from '@share/toast-notification/toast.service';
import {
    AuthRequest,
    BodyResponse,
    ErrorResponse,
    ILdapLoginRes,
    RequestFeApiModel,
    ResponseModel,
} from '@core/models/api.model';

const API_URL = environment.feApiUrl;
const API_URL_DOWNLOAD_FILE = environment.feApiUrlDownloadFile;
const API_AUTH = environment.ldapLoginUrl;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private dynamicDialog = inject(DynamicDialogService);
    private toastService = inject(ToastService);

    get headers(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        return new HttpHeaders(headersConfig);
    }

    authFetch(bodyRequest?: AuthRequest): Observable<BodyResponse<ILdapLoginRes>> {
        const requestBody = {
            header: environment.headerFeApi,
            body: {
                command: 'GET_ENQUIRY',
                data: {
                    ...bodyRequest,
                    authenType: bodyRequest?.authenType ?? 'getLogin',
                },
            },
        };
        return this.http
            .post<ResponseModel<ILdapLoginRes>>(
                this.generateUrl({
                    url: bodyRequest?.authenType ?? '',
                    isLogin: true,
                }),
                requestBody,
                {
                    headers: this.headers,
                },
            )
            .pipe(
                tap((content) => {
                    if (content.error) throw content.error;
                    return content;
                }),
                map((res) => res.body),
                tap({
                    next: (content) => this.handleSuccess(content.data, bodyRequest?.isRemember),
                }),
            );
    }

    post<T, D = undefined>(requestBody: RequestFeApiModel<D>): Observable<BodyResponse<T>> {
        const requestAPI = {
            header: environment.headerFeApi,
            body: {
                authenType: requestBody.authenType,
                data: requestBody.data,
            },
        };
        return this.http
            .post<ResponseModel<T>>(
                this.generateUrl({
                    url: requestBody.authenType,
                }) || environment.feApiUrl,
                requestAPI,
                {
                    headers: this.headers,
                },
            )
            .pipe(
                tap({
                    next: (content) => {
                        this.catchErrorF(content);
                    },
                }),
                map((res) => res.body),
            );
    }

    private catchErrorF<T>(content: ResponseModel<T>) {
        if (content.error) {
            if (content.error.code === '999') {
                this.dynamicDialog
                    .open({
                        type: 'error',
                        content: '',
                        header: 'Lỗi hệ thống',
                    })
                    .subscribe();
            }
            if (content.error.desc) {
                this.toastService.error(content.error.desc);
            }
            throw content.error as ErrorResponse;
        }
    }

    private generateUrl(ops: { url: string; isDownloadFIle?: boolean; isLogin?: boolean }): string {
        if (ops.isDownloadFIle) {
            return API_URL_DOWNLOAD_FILE;
        }
        if (ops.isLogin) {
            return JSON.parse(localStorage.getItem('enableMock') ?? 'false') ? `${API_AUTH}/${ops.url}` : API_AUTH;
        }
        return JSON.parse(localStorage.getItem('enableMock') ?? 'false') ? `${API_URL}/${ops.url}` : '';
    }

    private handleSuccess(content: ILdapLoginRes, isRemember?: boolean, isLoginClick = false): void {
        const { token, delegateId, fullName } = content;
    }
}
