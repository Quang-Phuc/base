import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';
import { DuplicateErrorKey } from '@share/share.constant';

export function checkIfDuplicate(formControlName: string): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const formArray = control?.parent?.parent ? (control?.parent?.parent as FormArray) : null;

        if (formArray?.controls.length) {
            const currentValue = control.value?.toString()?.trim()?.toLowerCase();
            const duplicateCount = formArray.controls.filter((group) => {
                const value = (group as FormGroup).get(formControlName)?.value;
                return value && value?.toString()?.trim()?.toLowerCase() === currentValue;
            }).length;

            return duplicateCount > 1 ? { [DuplicateErrorKey]: true } : null;
        }

        return null;
    };
}
