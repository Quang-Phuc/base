import { Component, computed, input } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { BaseControlAccessor } from '../base-control-accessor';
import { IftaLabel } from 'primeng/iftalabel';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { InputConfig, InputTypes } from '@core/models/input-control.model';
import { InputError } from '@share/input-error/input-error';
import { ModeEventsEnum, TypeInputControlsEnum, TypeLabelEnum } from '@core/enums/control-access.enum';

enum InternalTypeControlEnum {
    'number' = 'number',
    'textarea' = 'textarea',
    'text' = 'text',
}

type InternalTypeControlType = keyof typeof InternalTypeControlEnum;

@Component({
    selector: 'ase-input',
    imports: [
        InputText,
        FormsModule,
        IftaLabel,
        NgTemplateOutlet,
        FloatLabel,
        InputNumber,
        Textarea,
        NgStyle,
        InputError,
    ],
    templateUrl: './input.html',
    styles: `
        :host {
            display: inline-block;
        }
    `,
    standalone: true,
})
export class Input extends BaseControlAccessor<string | null | number> {
    protected readonly InternalTypeControlEnum = InternalTypeControlEnum;
    protected readonly TypeControlsEnum = TypeInputControlsEnum;
    protected readonly TypeLabelEnum = TypeLabelEnum;
    protected readonly Validators = Validators;

    override onValueChange(value: string | null) {
        if (
            [
                TypeInputControlsEnum.INPUT_NUMBER.toString(),
                TypeInputControlsEnum.INPUT_NUMBER_INTEGER.toString(),
            ].includes(this.inputType())
        ) {
            this.value.set(value ? String(value) : null);
        }
    }

    onInputText($event: Event) {
        const value = ($event.target as HTMLInputElement).value;
        this.updateValue(value);
    }

    configMinMaxNumber = computed<{
        min: number | null | undefined;
        max: number | null | undefined;
    }>(() => ({
        min: (this.inputConfig().min as number | null | undefined) || -999999999999,
        max: (this.inputConfig().max as number | null | undefined) || 999999999999,
    }));
    controlConfig = input<InputConfig>();
    maxLength = input(255);
    actionEvents = input<ModeEventsEnum>(this.ModeEventsEnum.NEW);
    inputType = input<InputTypes>(TypeInputControlsEnum.INPUT);
    label = input.required<string>();
    textAreaLength = computed<number>(() => {
        return this.value() ? String(this.value()).length : 0;
    });

    controlType = computed<InternalTypeControlType>(() => {
        const type = this.inputType();
        if (
            [
                TypeInputControlsEnum.INPUT_NUMBER_INTEGER.toString(),
                TypeInputControlsEnum.INPUT_NUMBER.toString(),
            ].includes(type!)
        ) {
            return InternalTypeControlEnum.number;
        }
        if (type === 'TEXT_AREA') {
            return InternalTypeControlEnum.textarea;
        }
        return InternalTypeControlEnum.text;
    });
    integerOrFloat = computed(() => {
        if (['INPUT_NUMBER_INTEGER'].includes(this.inputType()!)) {
            return {
                minFractionDigits: 0,
                maxFractionDigits: 0,
            };
        }
        return {
            minFractionDigits: 0,
            maxFractionDigits: 4,
        };
    });
    inputConfig = computed<InputConfig>(() => ({
        align: this.controlConfig()?.align || 'vertical',
        inputType: this.inputType(),
        inputId: this.controlConfig()?.inputId ?? Math.random().toString(),
        typeLabel: this.controlConfig()?.typeLabel || TypeLabelEnum.DEFAULT,
        ...this.controlConfig(),
    }));

    onBlur() {
        this.markAsTouched();
    }

    onInputNumberChange($event: number) {
        this.updateValue($event);
    }
}
