import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { Input } from '@core/_input/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocBlock } from '@share/doc-block/doc-block';
import { TypeInputControlsEnum } from '@core/enums/control-access.enum';
import { NgTemplateOutlet } from '@angular/common';
import { AseInputNumberInteger } from '@core/models/input-control.model';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';

@Component({
    selector: 'ase-input-doc',
    imports: [
        Input,
        FormsModule,
        DocBlock,
        NgTemplateOutlet,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel,
        ReactiveFormsModule,
    ],
    templateUrl: './input-doc.html',
    styles: ``,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDoc implements AfterViewInit {
    reactiveForm = viewChild<ElementRef>('reactiveForm');
    inputHTMLDefault = `<ase-input [(ngModel)]="fullname" label="Fullname"/>`;
    inputHTMLTextarea = `<ase-input [inputType]="TypeInputControlsEnum.INPUT_TEXTAREA" [(ngModel)]="address" label="Address"/>`;
    inputHTMLNumber = `<ase-input [inputType]="TypeInputControlsEnum.INPUT_NUMBER" [(ngModel)]="height" label="Height"/>`;
    inputHTMLNumberInteger = `<ase-input [inputType]="TypeInputControlsEnum.INPUT_NUMBER_INTEGER" [(ngModel)]="age" label="Age"/>`;
    inputHTMLNumberIntegerWithoutGrouping = `<ase-input [inputType]="TypeInputControlsEnum.INPUT_NUMBER_INTEGER" [(ngModel)]="phonenumber" label="Phone number" [controlConfig]="numberIntegerConfig"/>`;
    inputTSDefault = `import {Input} from "@core/_input/input";\n\nexport class InputDOC {
 fullname = '';
}`;
    inputTextareaTs = `import {Input} from "@core/_input/input";\n\nexport class InputDOC {
 address = '';
}`;
    inputNumberTs = `import { Input } from '@core/_input/input';\nimport { TypeInputControlsEnum } from "@core/enums/control-access.enum";\n\nexport class InputDOC {
    protected readonly TypeInputControlsEnum = TypeInputControlsEnum;
    height = 0;
}`;
    inputNumberIntegerTs = `import { Input } from '@core/_input/input';\nimport { TypeInputControlsEnum } from '@core/enums/control-access.enum';\n\nexport class InputDOC {
    protected readonly TypeInputControlsEnum = TypeInputControlsEnum;
     age = 0;
}`;
    inputNumberIntegerWithoutGroupingTs = `import { Input } from '@core/_input/input';\nimport { TypeInputControlsEnum } from '@core/enums/control-access.enum';\nimport { AseInputNumberInteger } from '@core/models/input-control.model';\n\nexport class InputDOC {
    protected readonly TypeInputControlsEnum = TypeInputControlsEnum;
    protected readonly numberIntegerConfig: AseInputNumberInteger = {
        inputType: TypeInputControlsEnum.INPUT_NUMBER_INTEGER,
        useGrouping: false,
    };
    phoneNumber = 0;
}`;
    inputWithReactiveFormHTML = `<form [formGroup]="dummyForm">\n    <ase-input formControlName="fullname" label="Fullname"/>\n</form>`;
    inputWithReactiveFormTS = `import { Input } from '@core/_input/input';\nimport { FormControl, FormGroup, Validators } from '@angular/forms';\n\nexport class InputDOC {
    dummyForm: FormGroup = new FormGroup({\n    fullname: new FormControl('', Validators.required),\n});\n}`;
    fullname = '';
    address = '';
    age = 0;
    height = 0;
    phoneNumber = 0;
    protected readonly TypeInputControlsEnum = TypeInputControlsEnum;
    protected readonly numberIntegerConfig: AseInputNumberInteger = {
        inputType: TypeInputControlsEnum.INPUT_NUMBER_INTEGER,
        useGrouping: false,
        min: 30,
    };
    dummyForm: FormGroup = new FormGroup({
        fullname: new FormControl('', Validators.required),
    });

    constructor() {
        console.log(this.reactiveForm());
    }

    ngAfterViewInit(): void {
        console.log(this.reactiveForm());
    }
}
