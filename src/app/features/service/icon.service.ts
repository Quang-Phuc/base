import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class IconService {
    constructor(private http: HttpClient) {}

    getIcons() {
        return this.http.get(this.apiUrl).pipe(
            map((response: any) => {
                this.icons = response.icons;
                return this.icons;
            }),
        );
    }

    icons!: any[];
    selectedIcon: any;
    apiUrl = 'assets/demo/data/icons.json';
}
