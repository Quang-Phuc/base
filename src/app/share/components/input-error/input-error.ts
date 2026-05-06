import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MessageErrorPipe } from '@share/input-error/message-error/message-error.pipe';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'ase-input-error',
    imports: [MessageErrorPipe, KeyValuePipe],
    templateUrl: './input-error.html',
    styles: ``,
    standalone: true,
})
export class InputError {
    control = input.required<AbstractControl | null>();
    label = input<string>('');
}
