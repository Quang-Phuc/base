import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'currencyFormat',
    standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
    constructor(private currency: CurrencyPipe) {}

    transform(value: string | undefined = '', type: 'integer' | 'float' = 'integer'): string {
        if (!value || isNaN(Number(value))) return '0';
        if (value && Number(value) < 0) return '0';
        return this.currency.transform(value, '', '', type === 'integer' ? '0.0-0' : '0.0-5') ?? '0';
    }
}
