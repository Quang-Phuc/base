import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    Injector,
    input,
    Renderer2,
    ViewContainerRef,
} from '@angular/core';
import { TableDataEnum } from '@share/share.enum';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Directive({
    standalone: true,
    selector: '[aseTypedDataTable]',
    providers: [DatePipe, CurrencyPipe],
})
export class TypedDataTable implements AfterViewInit {
    private datePipe = inject(DatePipe);
    private currencyPipe = inject(CurrencyPipe);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private vcr = inject(ViewContainerRef);
    private injector = inject(Injector);

    // ví dụ: cột hiện tại
    constructor() {}

    ngAfterViewInit(): void {
        switch (this.typedData()) {
            case TableDataEnum.dateTime:
                this.transformData(this.datePipe.transform(this.data(), 'dd/MM/yyyy HH:mm:ss') || '', 'center');
                break;
            case TableDataEnum.onlyDate:
                this.transformData(this.datePipe.transform(this.data(), 'dd/MM/yyyy') || '', 'center');
                break;
            case TableDataEnum.currency:
                this.transformData(this.currencyPipe.transform(this.data(), '', '', '0.0-0') ?? '', 'left');
                break;
            case TableDataEnum.float:
                this.transformData(this.currencyPipe.transform(this.data(), '', '', '0.0-5') ?? '', 'right');
                break;
            case TableDataEnum.integer:
                this.transformData(this.data() ?? '', 'right');
                break;
            case TableDataEnum.tag:
                [this.data()?.toLowerCase() || '', 'ase-tag'].forEach((c) =>
                    this.renderer.addClass(this.el.nativeElement, c),
                );
                this.transformData(this.data()?.toLowerCase() || '', 'center');
                break;
            default:
                this.transformData(this.data() || '', 'left');
                break;
        }
    }

    private transformData(value: string, textAlign: 'left' | 'right' | 'center' = 'left') {
        this.renderer.setProperty(this.el.nativeElement, 'textContent', value);
        this.renderer.setStyle(this.el.nativeElement, 'text-align', textAlign);
    }

    data = input(null, {
        transform: (value: unknown) => String(value),
    });
    typedData = input<TableDataEnum | null>(null);
}
