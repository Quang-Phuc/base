import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'ase-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: `
        <div class="layout-sidebar">
            <ase-menu></ase-menu>
        </div>
    `,
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
