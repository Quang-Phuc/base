import { ChangeDetectorRef, Directive, inject, signal, WritableSignal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ViewModes } from '@core/constants/control-access.constant';
import { ModeEventsEnum } from './enums/control-access.enum';


@Directive()
export abstract class BaseControlAccessor<T> implements ControlValueAccessor {
    readonly ViewModes = ViewModes;
    protected readonly ModeEventsEnum = ModeEventsEnum;
    protected ngControl: NgControl = inject(NgControl, { optional: true })!;
    protected value: WritableSignal<T | null> = signal(null);
    protected disabled = signal(false);
    protected cdr = inject(ChangeDetectorRef);
    private onChange: (value: T) => void = () => {};
    private onTouched: () => void = () => {};

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    // ----- Core CVA methods -----
    writeValue(value: T): void {
        this.value.set(value);
        this.onValueChange(value);
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    // ----- Utility methods -----
    protected markAsTouched(): void {
        this.onTouched();
        // this.cdr.detectChanges();
    }

    protected updateValue(value: T): void {
        this.value.set(value);
        this.markAsTouched();
        this.onChange(value);
    }

    // Cho phép component con override để xử lý khi giá trị thay đổi từ bên ngoài
    protected onValueChange(_value: T): void {}
}
