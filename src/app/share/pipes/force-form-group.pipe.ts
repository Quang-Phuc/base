import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
    name: 'forceFormGroup',
    standalone: true,
})
export class ForceFormGroupPipe implements PipeTransform {
    transform(value: unknown): FormGroup {
        return value as FormGroup;
    }
}
