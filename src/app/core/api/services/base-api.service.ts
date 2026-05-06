import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {ApiService} from "@core/services/api.service";

const API_URL = environment.apiBaseUrl;
const API_URL_DOWNLOAD_FILE = environment.apiBaseUrl;

@Injectable()
export abstract class BaseApiService {
    private readonly _apiServiceInject = inject(ApiService);

    protected generateUrl(url = '', isDowloadFIle = false): string | null {
        if (isDowloadFIle) {
            return API_URL_DOWNLOAD_FILE;
        }
        return JSON.parse(localStorage.getItem('enableMock') ?? 'false') ? `${API_URL}/${url}` : null;
    }

    protected get apiService(): ApiService {
        return this._apiServiceInject;
    }
}
