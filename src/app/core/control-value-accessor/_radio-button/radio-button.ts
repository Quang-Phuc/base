import { Component, input, output } from '@angular/core';
import { SelectOption } from '@core/models/select-control.model';
import { FormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { BaseControlAccessor } from '@core/base-control-accessor';
import { ModeEventsEnum } from '@core/enums/control-access.enum';

@Component({
    selector: 'ase-radio-button',
    imports: [FormsModule, RadioButton],
    templateUrl: './radio-button.html',
    styles: ``,
    standalone: true,
})
export class RadioBtn<T> extends BaseControlAccessor<string | number | null | T> {
    override onValueChange(_value: string | number | null | T) {
        this.updateValue(_value);
    }

    changeRadio($event: string | number | null) {
        this.markAsTouched();
        this.updateValue($event);
    }

    actionEvents = input<ModeEventsEnum>(this.ModeEventsEnum.NEW);
    options = input.required<SelectOption[]>();
    align = input<'vertical' | 'horizontal'>('horizontal');
    onChangeRadio = output<string | number | null | T>();
}
