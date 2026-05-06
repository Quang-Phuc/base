import {Component, computed, inject, NgZone, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotification } from '@share/toast-notification/toast-notification';
import {UserInfo} from "@share/user-info/user-info";
import {LoadingStore} from "./stores/loading.store";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastNotification, UserInfo],
    templateUrl: './app.html',
    standalone: true,
})
export class App {
    loadingState = inject(LoadingStore);
    isLoading = computed<boolean>(() => this.loadingState.isLoading());
    protected readonly title = signal('BPM-FE');
}
