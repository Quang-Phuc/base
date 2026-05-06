import { MenuItem } from 'primeng/api';
import { ActionEventsEnum, AppearanceEnum, StatusEnum, TableDataEnum } from '@share/share.enum';
import { TypeInputControlsEnum } from '@core/enums/control-access.enum';

export type StatusType = keyof typeof StatusEnum;

export interface ActionEvents extends MenuItem {
    showIn?: StatusType[];
    modified?: boolean;
    keyMapAction?: string;
    keyMapCondition?: string;
    action: ActionEventsEnum;
}

export interface TableColumnModel {
    field: string;
    label: string;
    width?: string;
    hidden?: boolean;
    frozen?: boolean;
    actionEvent?: ActionEventsEnum;
    inputType?: TypeInputControlsEnum;
    textAlign?: 'left' | 'center' | 'right';
    isCheckBox?: boolean;
    hiddenMobile?: boolean;
    typeData?: TableDataEnum;
    typeAppearance?: AppearanceEnum;
    required?: boolean;
}

export interface PaginationModel {
    pageNumber: number;
    pageSize: number;
}
