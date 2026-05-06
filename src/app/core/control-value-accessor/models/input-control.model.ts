import { TypeInputControlsEnum, TypeLabelEnum } from '@core/enums/control-access.enum';

export interface BaseInputConfig extends Partial<Record<string , string | number | boolean>> {
    typeLabel?: TypeLabelEnum;
    align?: 'horizontal' | 'vertical';
    suffix?: string;
    prefix?: string;
}

export interface AseInputText extends BaseInputConfig {
    inputId?: string;
    subLabel?: string;
    inputType: 'INPUT';
}

export interface AseInputTexArea extends BaseInputConfig {
    inputId?: string;
    subLabel?: string;
    inputType: 'TEXT_AREA';
    rows?: number;
    cols?: number;
    resizeTextArea?: boolean;
}

export interface AseInputNumber extends BaseInputConfig {
    inputId?: string;
    subLabel?: string;
    max?: number;
    inputType: 'INPUT_NUMBER';
    minFractionDigits?: number;
    maxFractionDigits?: number;
    min?: number;
    useGrouping?: boolean;
}

export interface AseInputNumberInteger extends BaseInputConfig {
    inputId?: string;
    subLabel?: string;
    max?: number;
    inputType: 'INPUT_NUMBER_INTEGER';
    min?: number;
    useGrouping?: boolean;
}

export type InputConfig = AseInputText | AseInputNumber | AseInputTexArea | AseInputNumberInteger;
export type InputTypes = keyof typeof TypeInputControlsEnum;
