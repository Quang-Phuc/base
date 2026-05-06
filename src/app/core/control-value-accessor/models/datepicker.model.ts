import { TypeDatepickerEnum, TypeLabelEnum } from '@core/enums/control-access.enum';

type DateFormat = 'dd/mm/yy' | 'dd/m/y' | 'mm/dd/yy';
type HoursFormat = '12' | '24';

export interface DatepickerBaseModel extends Record<any, any> {
    typeLabel?: TypeLabelEnum;
    align?: 'horizontal' | 'vertical';
    suffix?: string;
    icon?: string;
    minDate?: Date;
    maxDate?: Date;
    inputId?: string;
}

export interface DatepickerDefault extends DatepickerBaseModel {
    pickerType: 'DEFAULT';
    format?: DateFormat;
    showTime?: boolean;
}

export interface Timepicker extends DatepickerBaseModel {
    pickerType: 'TIME_PICKER';
    hourFormat: HoursFormat;
}

export interface RangePicker extends DatepickerBaseModel {
    pickerType: 'RANGE_DATE';
    format?: DateFormat;
    readonlyInput?: boolean;
}

export interface MonthPicker extends DatepickerBaseModel {
    pickerType: 'MONTH_PICKER';
    readonlyInput?: boolean;
}

export interface YearPicker extends DatepickerBaseModel {
    pickerType: 'YEAR_PICKER';
    readonlyInput?: boolean;
}

export type DatepickerConfig = DatepickerDefault | Timepicker | RangePicker | MonthPicker | YearPicker;
export type DatepickerType = keyof typeof TypeDatepickerEnum;
