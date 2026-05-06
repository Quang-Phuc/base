import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

interface ToastMessage {
    type: NotificationType;
    message?: string;
    params?: { [p: string]: string };
}

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private message = new Subject<ToastMessage>();

    /**
     *
     * @param message string to show
     * @param params is Object includes name and value pass to named interpolation
     */
    success(message: string, params?: { [p: string]: string }) {
        this.message.next({
            type: 'success',
            message: message,
            params,
        });
    }

    /**
     *
     * @param message string to show
     * @param params is Object includes name and value pass to named interpolation
     */
    error(message: string, params?: { [p: string]: string }) {
        this.message.next({
            type: 'error',
            message: message,
            params,
        });
    }

    message$ = this.message.asObservable();
}
