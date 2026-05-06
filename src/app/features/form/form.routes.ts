import {Routes} from "@angular/router";
import {InputDoc} from "@features/form/input-doc/input-doc";
import {SelectDoc} from "@features/form/select-doc/select-doc";
import {CheckboxDoc} from "@features/form/checkbox-doc/checkbox-doc";
import {RadioDoc} from "@features/form/radio-doc/radio-doc";

export default [
    {path: 'input', component: InputDoc},
    {path: 'select', component: SelectDoc},
    {path: 'checkbox', component: CheckboxDoc},
    {path: 'radio', component: RadioDoc},
] as Routes;
