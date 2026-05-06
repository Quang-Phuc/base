import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { Toast, ToastPositionType } from 'primeng/toast';
import { AseIcon } from '@share/ase-icon/ase-icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationType, ToastService } from '@share/toast-notification/toast.service';
import { capitalizeString } from '../../utilities/common';

@Component({
    selector: 'ase-toast-notification',
    imports: [Toast, AseIcon, PrimeTemplate],
    templateUrl: './toast-notification.html',
    styles: ``,
    standalone: true,
    providers: [MessageService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotification implements OnInit {
    readonly messageService = inject(MessageService);
    readonly toastService = inject(ToastService);
    private destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.toastService.message$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => {
            this.messageService.add({
                severity: m.type,
                summary: capitalizeString(m.type),
                detail: m.message,
                data: m.params,
            });
        });
    }

    position: ToastPositionType = 'top-right';
    duration = 3000;
    type: NotificationType = 'success';
    message = '';
}
