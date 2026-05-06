import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { BaseControlAccessor } from '@core/base-control-accessor';

@Component({
    selector: 'ase-search-simple',
    imports: [InputText, ReactiveFormsModule, FormsModule],
    templateUrl: './search-simple.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SearchSimple extends BaseControlAccessor<string | undefined> {
    onSearch = output<string | undefined | null>();
    onChangeInput($event: string) {
        this.updateValue($event);
    }
}
