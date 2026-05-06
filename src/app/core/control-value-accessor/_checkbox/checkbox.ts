import { Component, input, output } from '@angular/core';
import { BaseControlAccessor } from '@core/base-control-accessor';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '@core/models/select-control.model';
import { InputError } from '@share/input-error/input-error';
import { ModeEventsEnum } from '@core/enums/control-access.enum';

@Component({
    selector: 'ase-checkbox',
    imports: [Checkbox, FormsModule, InputError],
    templateUrl: './checkbox.html',
    styles: ``,
    standalone: true,
})
export class CheckboxCtr<T = string> extends BaseControlAccessor<string | string[] | number | number[] | null | T> {
    override onValueChange(_value: string | string[] | number | number[] | null | T) {
        this.updateValue(_value);
    }

    changeCheckBox($event: CheckboxChangeEvent) {
        this.onChangeCheckbox.emit($event);
        this.markAsTouched();
        this.updateValue($event.checked);
    }

    actionEvents = input<ModeEventsEnum>(this.ModeEventsEnum.NEW);
    align = input<'vertical' | 'horizontal'>('horizontal');
    options = input.required<SelectOption[]>();
    onChangeCheckbox = output<CheckboxChangeEvent>();
}
