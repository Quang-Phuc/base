import { Component, computed, input, signal } from '@angular/core';
import { BaseControlAccessor } from '@core/base-control-accessor';
import { FloatLabel } from 'primeng/floatlabel';
import { IftaLabel } from 'primeng/iftalabel';
import { InputError } from '@share/input-error/input-error';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerConfig, DatepickerType } from '@core/models/datepicker.model';
import { DatePicker, DatePickerTypeView } from 'primeng/datepicker';
import { AseIcon } from '@share/ase-icon/ase-icon';
import { ModeEventsEnum, TypeDatepickerEnum, TypeLabelEnum } from '@core/enums/control-access.enum';

@Component({
    selector: 'ase-datepicker',
    imports: [
        FloatLabel,
        IftaLabel,
        InputError,
        NgTemplateOutlet,
        ReactiveFormsModule,
        FormsModule,
        DatePicker,
        AseIcon,
    ],
    templateUrl: './datepicker.html',
    standalone: true,
})
export class Datepicker extends BaseControlAccessor<Date | Date[] | string | string[] | undefined> {
    protected readonly Validators = Validators;
    readonly viewMapping: Record<TypeDatepickerEnum, DatePickerTypeView> = {
        [TypeDatepickerEnum.DEFAULT]: 'date',
        [TypeDatepickerEnum.MONTH_PICKER]: 'month',
        [TypeDatepickerEnum.YEAR_PICKER]: 'year',
        [TypeDatepickerEnum.RANGE_DATE]: 'date',
        [TypeDatepickerEnum.TIME_PICKER]: 'date',
    };
    protected readonly TypeLabelEnum = TypeLabelEnum;

    override onValueChange(_value: Date | Date[] | string | string[] | undefined) {
        let val = _value;
        if (!Array.isArray(_value) && this.dateType() === TypeDatepickerEnum.RANGE_DATE) {
            val = [_value, null] as Date[];
        }
        this.updateValue(val);
    }

    onDateChange($event: Date) {
        this.setInvalidState();
        this.updateValue($event);
    }

    checkBlur() {
        this.markAsTouched();
        this.setInvalidState();
    }

    onClearValue() {
        this.updateValue(undefined);
        this.setInvalidState();
    }

    actionEvents = input<ModeEventsEnum>(ModeEventsEnum.NEW);
    controlConfig = input<DatepickerConfig>();
    dateType = input<DatepickerType>('DEFAULT');
    label = input.required<string>();
    dateConfig = computed<DatepickerConfig>(() => ({
        align: this.controlConfig()?.align || 'vertical',
        pickerType: this.dateType(),
        hourFormat: this.controlConfig()?.['hourFormat'] || '24',
        format: this.controlConfig()?.format || 'dd/mm/yy',
        readonlyInput: this.controlConfig()?.readonlyInput ?? true,
        typeLabel: this.controlConfig()?.typeLabel || TypeLabelEnum.DEFAULT,
        inputId: this.controlConfig()?.inputId || Math.random().toString(),
        ...this.controlConfig(),
    }));
    readonly dateFormatMapping = computed<Record<TypeDatepickerEnum, string | undefined>>(() => ({
        [TypeDatepickerEnum.DEFAULT]: this.dateConfig().format,
        [TypeDatepickerEnum.MONTH_PICKER]: 'mm',
        [TypeDatepickerEnum.YEAR_PICKER]: 'yy',
        [TypeDatepickerEnum.RANGE_DATE]: this.dateConfig().format,
        [TypeDatepickerEnum.TIME_PICKER]: undefined,
    }));
    invalidState = signal(false);
    cssClass = computed(() => (this.invalidState() ? 'ng-invalid ng-dirty ng-touched w-full' : 'ng-valid w-full'));
    propertiesConfig = computed(() => ({
        selectionMode:
            this.dateConfig().pickerType === TypeDatepickerEnum.RANGE_DATE
                ? 'range'
                : ('single' as 'single' | 'multiple' | 'range' | undefined),
        hourFormat: [TypeDatepickerEnum.DEFAULT].includes(this.dateType() as TypeDatepickerEnum)
            ? this.dateConfig().hourFormat
            : undefined,
        timeOnly: this.dateConfig().pickerType === TypeDatepickerEnum.TIME_PICKER,
        dateFormat: this.dateFormatMapping()[this.dateType()],
        view: this.viewMapping[this.dateType()],
        cssClass: this.cssClass(),
    }));

    private setInvalidState() {
        const invalid = (this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty)) ?? false;
        this.invalidState.set(invalid);
    }
}
