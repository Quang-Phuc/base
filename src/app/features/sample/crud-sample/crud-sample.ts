import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    DestroyRef,
    inject,
    model,
    signal,
    WritableSignal,
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActionEvents, PaginationModel, TableColumnModel } from '@share/table-data.model';
import { ActionEventsEnum, StatusEnum, TableDataEnum } from '@share/share.enum';
import { PaginatorState } from 'primeng/paginator';
import { TableData } from '@share/table-data/table-data';
import { Input } from '@core/_input/input';
import { SelectControl } from '@core/_select/select';
import { RadioBtn } from '@core/_radio-button/radio-button';
import { CheckboxCtr } from '@core/_checkbox/checkbox';
import { JsonPipe } from '@angular/common';
import { Upload } from '@core/_upload/upload';
import { Datepicker } from '@core/_datepicker/datepicker';
import {
    ModeEventsEnum,
    TypeDatepickerEnum,
    TypeInputControlsEnum,
    TypeSelectsEnum,
} from '@core/enums/control-access.enum';
import { DialogConfirm } from '@share/dialog-confirm/dialog-confirm';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DialogModify } from '@share/dialog-modify/dialog-modify';
import { DynamicDialogService } from '@share/dynamic-dialog.service';
import { SearchSimple } from '@share/search-simple/search-simple';
import { CrudService } from '@features/sample/crud-sample/services/crud-service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectOption } from '@core/models/select-control.model';
import { checkIfDuplicate } from '@share/duplicate.validator';
import { SelectChangeEvent } from 'primeng/select';
import { triggerRevalidation } from '../../../share/utilities/common';

enum FilterColumnEnum {
    TOTAL_ATTENDING = 'TOTAL_ATTENDING',
    TOTAL_ABSENT = 'TOTAL_ABSENT',
    DIRECT_ATTENDING = 'DIRECT_ATTENDING',
    DIRECT_ABSENT = 'DIRECT_ABSENT',
    PROXY_ATTENDING = 'PROXY_ATTENDING',
    PROXY_ABSENT = 'PROXY_ABSENT',
}

enum RangeEnum {
    GREATER_THAN_ZERO = 'GREATER_THAN_ZERO',
    EQUAL_ZERO = 'EQUAL_ZERO',
}

const rangeOption: SelectOption<RangeEnum>[] = [
    { label: '> 0', value: RangeEnum.GREATER_THAN_ZERO },
    { label: '= 0', value: RangeEnum.EQUAL_ZERO },
];
const filterOption: SelectOption<FilterColumnEnum>[] = [
    {
        label: 'Tổng số CP sở hữu tham dự',
        value: FilterColumnEnum.TOTAL_ATTENDING,
    },
    {
        label: 'Tổng số CP sở hữu không tham dự',
        value: FilterColumnEnum.TOTAL_ABSENT,
    },
    {
        label: 'Số CP sở hữu tham dự - trực tiếp',
        value: FilterColumnEnum.DIRECT_ATTENDING,
    },
    {
        label: 'Số CP sở hữu không tham dự - trực tiếp',
        value: FilterColumnEnum.DIRECT_ABSENT,
    },
    {
        label: 'Số CP sở hữu tham dự - UQ',
        value: FilterColumnEnum.PROXY_ATTENDING,
    },
    {
        label: 'Số CP sở hữu không tham dự - UQ',
        value: FilterColumnEnum.PROXY_ABSENT,
    },
];

@Component({
    selector: 'ase-crud-sample',
    imports: [
        TableData,
        ReactiveFormsModule,
        Input,
        SelectControl,
        RadioBtn,
        CheckboxCtr,
        JsonPipe,
        Upload,
        Datepicker,
        DialogConfirm,
        ButtonDirective,
        Ripple,
        DialogModify,
        SearchSimple,
        FormsModule,
    ],
    templateUrl: './crud-sample.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrudSample {
    // data table
    cols = signal<TableColumnModel[]>([
        {
            label: 'meetingCode',
            field: 'meetingCode',
        },
        {
            label: 'companyName',
            field: 'companyName',
        },
        {
            label: 'tickerSymbol',
            field: 'tickerSymbol',
        },
        {
            label: 'meetingType',
            field: 'meetingType',
            typeData: TableDataEnum.background,
            width: '220px',
        },
        {
            label: 'term',
            field: 'term',
        },
        {
            label: 'createdBy',
            field: 'createdBy',
        },
        {
            label: 'createdDate',
            field: 'createdDate',
            typeData: TableDataEnum.onlyDate,
        },
        {
            label: 'status',
            field: 'status',
            typeData: TableDataEnum.background,
        },
    ]);
    actionEvents = signal<ActionEvents[]>([
        {
            action: ActionEventsEnum.EDIT,
            label: 'Edit',
        },
    ]);
    pagination = signal<PaginationModel>({
        pageNumber: 0,
        pageSize: 10,
    });
    visibleModify = signal(false);
    // dataTable = computed(() => this.listingResource.value()?.data?.meetingAseanList ?? []);
    // totalElement = computed(() => this.listingResource.value()?.data?.totalElements ?? 0);
    rangeOption = signal<SelectOption<RangeEnum>[]>(rangeOption);
    // listingResource = rxResource({
    //     params: () => this.pagination(),
    //     stream: ({ params }) => this.crudService.getData(params),
    // });
    actions: WritableSignal<ActionEvents[]> = signal<ActionEvents[]>([
        {
            label: ActionEventsEnum.EDIT,
            action: ActionEventsEnum.EDIT,
            keyMapAction: 'status',
            showIn: [StatusEnum.CREATED, StatusEnum.LOCKED],
            icon: ActionEventsEnum.EDIT.toLowerCase(),
        },
        {
            label: ActionEventsEnum.DELETE,
            action: ActionEventsEnum.DELETE,
            keyMapAction: 'status',
            showIn: [StatusEnum.CREATED, StatusEnum.LOCKED],
            icon: ActionEventsEnum.DELETE.toLowerCase(),
        },
        {
            label: 'close iocn abc',
            action: ActionEventsEnum.CLOSE,
            icon: ActionEventsEnum.CLOSE.toLowerCase(),
            keyMapAction: 'status',
            showIn: [StatusEnum.LOCKED],
        },
    ]);
    // end data table
    search = signal('');
    rsDialog = model(false);
    visibleDialog = signal(false);

    // Có thể dùng luôn loading state có sẵn
    // isLoading = this.listingResource.isLoading;

    readonly MASTER_OPTIONS: SelectOption<FilterColumnEnum>[] = [
        { label: 'Tổng số CP sở hữu tham dự', value: FilterColumnEnum.TOTAL_ATTENDING },
        { label: 'Tổng số CP sở hữu không tham dự', value: FilterColumnEnum.TOTAL_ABSENT },
        { label: 'Số CP sở hữu tham dự - trực tiếp', value: FilterColumnEnum.DIRECT_ATTENDING },
        { label: 'Số CP sở hữu không tham dự - trực tiếp', value: FilterColumnEnum.DIRECT_ABSENT },
        { label: 'Số CP sở hữu tham dự - UQ', value: FilterColumnEnum.PROXY_ATTENDING },
        { label: 'Số CP sở hữu không tham dự - UQ', value: FilterColumnEnum.PROXY_ABSENT },
    ];

    private formValuesSignal = signal<FilterColumnEnum[]>([]);
    filterOption = computed(() => {
        const values = this.formValuesSignal();
        const controls = this.shareOwnershipQueryListFormArr.controls;
        const map = new Map<AbstractControl, SelectOption<FilterColumnEnum>[]>();
        controls.forEach((control, index) => {
            const othersTaken = values.filter((_, i) => i !== index && _ !== null);
            const availableOptions = this.MASTER_OPTIONS.filter(
                opt => !othersTaken.includes(opt.value)
            );
            map.set(control, availableOptions);
        });
        return map;
    });

    fb = inject(NonNullableFormBuilder);
    demoForm: FormGroup = this.fb.group({
        textInput: ['', [Validators.required]],
        selectInput: [null, [Validators.required]],
        radioInput: [null, [Validators.required]],
        checkboxInput: [null, [Validators.required]],
        uploadInput: [null, [Validators.required]],
        search: [null, [Validators.required]],
        dateInput: [new Date('2025-10-08T17:00:00.000Z'), [Validators.required]],
        shareOwnershipQueryList: this.fb.array([]),
    });
    protected readonly TypeControlsEnum = TypeInputControlsEnum;
    protected readonly TypeSelectsEnum = TypeSelectsEnum;
    protected readonly TypeDatepickerEnum = TypeDatepickerEnum;
    protected readonly ActionEventsEnum = ModeEventsEnum;
    protected readonly destroyRef = inject(DestroyRef);
    private dynamicDialogService = inject(DynamicDialogService);
    private cdr = inject(ChangeDetectorRef);

    constructor(private crudService: CrudService) {
        // this.shareOwnershipQueryListFormArr.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        //     next: () => {
        //         triggerRevalidation(this.shareOwnershipQueryListFormArr, 'column');
        //     },
        // });
    }

    get shareOwnershipQueryListFormArr(): FormArray {
        return this.demoForm.get('shareOwnershipQueryList') as FormArray;
    }

    buildForm(): FormGroup {
        return this.fb.group({
            column: ['', Validators.required],
            range: [RangeEnum.GREATER_THAN_ZERO],
        });
    }

    pageChange($event: PaginatorState) {
        this.pagination.set({
            pageNumber: $event.page ?? 0,
            pageSize: $event.rows ?? 0,
        });
    }

    uploadFile($event: Event) {
        const files = ($event.target as HTMLInputElement).files as FileList;
        this.demoForm.get('uploadInput')?.setValue(Array.from(files));
    }

    checkConfirm() {}

    modifyConfirm() {}

    openDynamic() {
        this.dynamicDialogService
            .open({
                header: 'title',
                content: 'test dynamic',
                type: 'confirm',
            })
            .subscribe({
                next: (res) => {},
            });
    }

    checkSearch($event: string | undefined | null) {
        console.log($event);
    }

    addNew() {
        console.log('abc');
    }

    sendEvent($event: { event: ActionEventsEnum; record: any }) {
        console.log($event);
    }

    addForm() {
        if (this.shareOwnershipQueryListFormArr.length === 6 || this.shareOwnershipQueryListFormArr.invalid) return;
        this.shareOwnershipQueryListFormArr.push(this.buildForm());
        this.syncValues();
    }

    searchRange() {
        console.log(this.shareOwnershipQueryListFormArr.value);
    }

    changeColumn($event: SelectChangeEvent, index: number) {
        this.shareOwnershipQueryListFormArr.at(index).get('column')?.setValue($event.value);
        this.syncValues();
    }

    removeForm(index: number) {
        this.shareOwnershipQueryListFormArr.removeAt(index);
        this.syncValues(); // Update signal
    }

    private syncValues() {
        const rawValues = this.shareOwnershipQueryListFormArr.getRawValue();
        const columnValues: FilterColumnEnum[] = rawValues.map((item) => item.column as FilterColumnEnum);
        this.formValuesSignal.set(columnValues);
    }
}
