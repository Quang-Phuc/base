import { HttpResponse } from 'msw';
import { environment } from '../../environments/environment';
import { ErrorResponse, ResponseModel } from '@core/models/api.model';

type StatusType = 400 | 401 | 403 | 404 | 500 | 0 | 200;

export function mockHttpStatusCase<T>(
    httpStatus: StatusType,
    data: T,
    url = '',
    error?: ErrorResponse,
): HttpResponse<ResponseModel<T>> {
    return httpStatus !== 200
        ? new HttpResponse(null, {
              status: httpStatus,
          })
        : HttpResponse.json<ResponseModel<T>>({
              body: {
                  status: 'OK',
                  data: data,
                  authenType: url,
              },
              error: error,
          });
}

export const mockErrorResponse = (error = false, errorCode = '999', desc = ''): ErrorResponse | undefined => {
    return error
        ? {
              desc: desc,
              code: errorCode,
              messageEn: '',
              messageVn: '',
          }
        : undefined;
};
export const urlMock = environment.feApiUrl;
export const urlLoginMock = environment.ldapLoginUrl;
export const urlMockDownFile = environment.feApiUrlDownloadFile;
export const urlMockUpFile = environment.feApiFileUrl;
