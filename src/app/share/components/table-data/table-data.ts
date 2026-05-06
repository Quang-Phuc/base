import {
    ChangeDetectionStrategy,
    Component,
    input,
    InputSignal,
    output,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { AseIcon } from '@share/ase-icon/ase-icon';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { ActionEvents, PaginationModel, TableColumnModel } from '@share/table-data.model';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ActionEventsEnum, AppearanceEnum } from '@share/share.enum';
import { TypedDataTable } from '@share/typed-data-table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'ase-table-data',
    imports: [
        TableModule,
        Select,
        Paginator,
        FormsModule,
        AseIcon,
        Menu,
        Button,
        NgTemplateOutlet,
        TypedDataTable,
        NgStyle,
        ToggleSwitch,
    ],
    templateUrl: './table-data.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableData<T> {
    @ViewChild('paginatorRef') paginatorRef!: Paginator;
    cols: InputSignal<TableColumnModel[]> = input.required<TableColumnModel[]>();
    dataTable: InputSignal<T[]> = input.required<T[]>();
    isPagination: InputSignal<boolean> = input<boolean>(true);
    rowsPerPageOptions: InputSignal<number[]> = input<number[]>([10, 25, 50, 70, 100]);
    pagination = input<PaginationModel>({
        pageSize: 10,
        pageNumber: 0,
    });
    totalRecords = input<number>(0);
    first = signal(0);
    actionEvents: InputSignal<ActionEvents[]> = input<ActionEvents[]>([]);
    paginatorState: WritableSignal<PaginatorState> = signal<PaginatorState>({
        first: this.first(),
        rows: this.pagination()?.pageSize,
        page: this.pagination().pageNumber,
        pageCount: 0,
    });
    items: MenuItem[] | undefined;
    pageChange = output<PaginatorState>();
    sendActionEvents = output<{ event: ActionEventsEnum; record: T }>();
    switchToggle = output<{ id: string; value: boolean }>();
    protected readonly AppearanceEnum = AppearanceEnum;
    private emitEventConfirm = signal<{ event: ActionEventsEnum; record: T } | null>(null);
    private isOpenConfirmDelete = signal(false);
    constructor() {
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Refresh',
                        icon: 'pi pi-refresh'
                    },
                    {
                        label: 'Export',
                        icon: 'pi pi-upload'
                    }
                ]
            }
        ];
    }

    onPageChange($event: PaginatorState) {
        this.paginatorState.update((state) => ({ ...state, ...$event }));
        this.pageChange.emit(this.paginatorState());
    }

    onSizeChange($event: number) {
        this.paginatorState.update((state) => ({ ...state, rows: $event }));
        this.pageChange.emit(this.paginatorState());
    }

    sendEvents(action: ActionEventsEnum, rowData: T) {
        if (action === ActionEventsEnum.DELETE) {
            this.emitEventConfirm.set({ event: action, record: rowData });
            this.isOpenConfirmDelete.set(true);
            return;
        }
        this.sendActionEvents.emit({
            event: action,
            record: rowData,
        });
    }
}
