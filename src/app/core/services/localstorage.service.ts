import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class LocalstorageService {
    getToken(): string | null{
        return localStorage.getItem('token');
    }
}
