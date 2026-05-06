import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseSignalControl } from '../base-signal-control';
import { TypeInputControlsEnum } from '@core/enums/control-access.enum';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'ase-input-signal',
    imports: [FormsModule, InputText],
    templateUrl: './input-signal.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSignal extends BaseSignalControl {
    controlType = input<TypeInputControlsEnum>(TypeInputControlsEnum.INPUT);
    protected readonly TypeInputControlsEnum = TypeInputControlsEnum;
}
