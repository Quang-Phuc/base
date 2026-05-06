import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { AseIcon } from '@share/ase-icon/ase-icon';
import { PrimeTemplate } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Button } from 'primeng/button';
import { ActionEventsEnum } from '@share/share.enum';

@Component({
    selector: 'ase-dialog-modify',
    imports: [AseIcon, PrimeTemplate, Drawer, Button],
    templateUrl: './dialog-modify.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogModify {
    onCloseDialog() {
        this.onCancel.emit();
        this.visible.set(false);
    }

    customBtnGroup = input(false);
    titleDialog = input('');
    dialogWidth = input('40%');
    visible = model.required<boolean>();
    cancelBtn = input('');
    confirmBtn = input('');
    actionEvents = input<ActionEventsEnum>(ActionEventsEnum.NEW);
    onConfirm = output<void>();
    onCancel = output<void>();
    actionBtnMapping: Partial<Record<ActionEventsEnum, string>> = {
        [ActionEventsEnum.EDIT]: 'Xác nhận',
        [ActionEventsEnum.APPROVE]: 'Duyệt',
        [ActionEventsEnum.NEW]: 'Lưu',
        [ActionEventsEnum.IMPORT]: 'Tải lên',
        [ActionEventsEnum.SEND]: 'Gửi',
        [ActionEventsEnum.PRINT]: 'In',
    };

    submitDialog() {
        this.onConfirm.emit();
        this.visible.set(false);
    }
}
