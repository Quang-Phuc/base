import { Component, computed, input, output } from '@angular/core';
import { BaseControlAccessor } from '../base-control-accessor';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule, Validators } from '@angular/forms';
import { SelectConfig, SelectOption } from '@core/models/select-control.model';
import { IftaLabel } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { NgTemplateOutlet } from '@angular/common';
import { InputError } from '@share/input-error/input-error';
import { ModeEventsEnum, TypeLabelEnum, TypeSelectsEnum } from '@core/enums/control-access.enum';

@Component({
    selector: 'ase-select',
    imports: [Select, FormsModule, IftaLabel, FloatLabel, NgTemplateOutlet, InputError],
    templateUrl: './select.html',
    styles: ``,
    standalone: true,
})
export class SelectControl<T extends undefined> extends BaseControlAccessor<string | string[] | null | T | T[]> {
    protected readonly TypeLabelEnum = TypeLabelEnum;
    protected readonly TypeSelectsEnum = TypeSelectsEnum;

    override onValueChange(_value: string | string[] | null) {
        this.updateValue(_value);
    }

    selectChange($event: SelectChangeEvent) {
        this.onSelectChange.emit($event);
        this.markAsTouched();
        this.updateValue($event.value);
    }

    actionEvents = input<ModeEventsEnum>(this.ModeEventsEnum.NEW);
    options = input.required<SelectOption[]>();
    controlConfig = input<SelectConfig<T>>();
    onSelectChange = output<SelectChangeEvent>();

    selectConfig = computed<SelectConfig<T>>(() => ({
        typeLabel: this.controlConfig()?.typeLabel || TypeLabelEnum.DEFAULT,
        align: this.controlConfig()?.align || 'vertical',
        selectType: this.controlConfig()?.selectType ?? this.selectTypes(),
        optionsGroup: this.controlConfig()?.optionsGroup?.() ?? [],
        ...this.controlConfig(),
    }));
    label = input.required<string>();
    selectTypes = input<TypeSelectsEnum>(TypeSelectsEnum.SELECT_DEFAULT);

    onBlur() {
        this.markAsTouched();
    }

    protected readonly Validators = Validators;
}
