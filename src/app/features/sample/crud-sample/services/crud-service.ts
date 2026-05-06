import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';
import { Observable } from 'rxjs';
import { BodyResponse } from '@core/models/api.model';
import { PaginationModel } from '@share/table-data.model';


@Injectable({
    providedIn: 'root',
})
export class CrudService extends BaseApiService {

    getData(pagination: PaginationModel): Observable<BodyResponse<any>> {
        return this.apiService.post({
            data: {
                search: '',
                pagination,
            },
            authenType: 'getAllMeetingAsean',
        });
    }

    findCongressById(meetingCode: string): Observable<BodyResponse<any>> {
        return this.apiService.post({
            data: { meetingCode },
            authenType: 'getMeetingAsean',
        });
    }
}
