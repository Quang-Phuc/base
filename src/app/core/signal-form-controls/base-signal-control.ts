import { Directive, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Directive()
export abstract class BaseSignalControl implements FormValueControl<string> {
    value = model<string>('');
}
