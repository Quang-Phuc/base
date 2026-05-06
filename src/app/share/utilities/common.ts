import {FormArray, FormGroup} from "@angular/forms";

export const capitalizeString = (string: string) => {
    if (!string) return '';
    return string
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
export function triggerRevalidation(
    formArray: FormArray,
    formControlName: string
) {
    formArray.controls.forEach((group) => {
        const control = (group as FormGroup).get(formControlName);
        if (control) {
            control.updateValueAndValidity({ emitEvent: false });
        }
    });
}
