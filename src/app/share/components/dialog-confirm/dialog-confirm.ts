import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { AseIcon } from '@share/ase-icon/ase-icon';
import { PrimeTemplate } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'ase-dialog-confirm',
    imports: [Dialog, AseIcon, PrimeTemplate, Button, ButtonDirective, Ripple],
    templateUrl: './dialog-confirm.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirm {
    onHide() {
        this.visible.set(false);
        this.doCancel.emit(true);
    }

    submit() {
        this.visible.set(false);
        this.doConfirm.emit(true);
    }

    visible = model.required<boolean>();
    dialogType = input<'confirm' | 'error'>('confirm');
    dialogWidth = input('458px');
    titleDialog = input('');
    content = input('');
    icon = input('');
    confirmLabelBTN = input('Xác nhận');
    cancelLabelBTN = input('Hủy');
    doCancel = output<boolean | undefined>();
    doConfirm = output<boolean | undefined>();
}
