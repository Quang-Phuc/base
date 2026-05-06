import { TypeLabelEnum, TypeSelectsEnum } from '@core/enums/control-access.enum';
import { TemplateRef } from '@angular/core';

export interface BaseSelectConfig extends Record<any, any> {
    typeLabel?: TypeLabelEnum;
    align?: 'horizontal' | 'vertical';
    showClear?: boolean;
    filter?: boolean;
    virtualScroll?: boolean;
}

export interface SelectDefault extends BaseSelectConfig {
    selectId?: string;
    selectType: 'SELECT_DEFAULT';
    subLabel?: string;
}

export interface SelectTemplate<D = undefined> extends BaseSelectConfig {
    selectId?: string;
    selectType: 'SELECT_TEMPLATE';
    templateRef?: TemplateRef<D>;
    subLabel?: string;
}

export interface SelectGroup<T> extends BaseSelectConfig {
    optionsGroup: T;
    selectId?: string;
    selectType: 'SELECT_GROUP';
    subLabel?: string;
}

export interface SelectOption<T = string | number | null | boolean> {
    label: string;
    value: T;
}

export type SelectConfig<T> = SelectDefault | SelectTemplate<T> |  SelectGroup<T>;
export type SelectTypes = keyof typeof TypeSelectsEnum;
