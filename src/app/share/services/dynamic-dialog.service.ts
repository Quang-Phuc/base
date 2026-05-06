import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    Injectable,
    inputBinding,
    outputBinding,
} from '@angular/core';
import { DialogConfirm } from '@share/dialog-confirm/dialog-confirm';
import { Observable, Subject } from 'rxjs';

interface DialogInput {
    type?: 'error' | 'confirm';
    width?: string;
    header: string;
    content: string;
    icon?: string;
}

@Injectable({
    providedIn: 'root',
})
export class DynamicDialogService {
    private componentRef?: ComponentRef<DialogConfirm>;

    constructor(
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector,
    ) {}

    open(option: DialogInput): Observable<boolean> {
        const close$ = new Subject<boolean>();

        this.componentRef = createComponent(DialogConfirm, {
            environmentInjector: this.injector,
            bindings: [
                inputBinding('visible', () => true),
                inputBinding('icon', () => option.icon),
                inputBinding('dialogType', () => option.type),
                inputBinding('titleDialog', () => option.header),
                inputBinding('dialogWidth', () => option.width ?? '464px'),
                inputBinding('content', () => option.content),
                outputBinding<void>('doConfirm', () => {
                    close$.next(true);
                    close$.complete();
                    this.removeDialog();
                }),
                outputBinding<void>('doCancel', () => {
                    close$.next(false);
                    close$.complete();
                    this.removeDialog();
                }),
            ],
        });

        const domElement = this.componentRef.location.nativeElement;
        document.body.appendChild(domElement);
        this.appRef.attachView(this.componentRef.hostView);

        return close$.asObservable();
    }

    protected removeDialog() {
        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
            this.componentRef = undefined;
        }
    }
}
