import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'ase-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            @for (item of model; track item) {
                @if (!item.separator) {
                    <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
                } @else {
                    <li class="menu-separator"></li>
                }
            }
        </ul>
    `,
})
export class AppMenu implements OnInit {
    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', routerLink: ['/'] }],
            },
            {
                label: 'Pages',
                routerLink: ['/pages'],
                items: [
                    // Thêm mục Quản lý tin tức ở đây
                    {
                        label: 'News Management',
                        icon: 'pi pi-fw pi-megaphone', // Icon cái loa cho máu
                        routerLink: ['/news-management'],
                    },
                    {
                        label: 'Sample',
                        routerLink: ['/pages/sample-crud'],
                    },
                    {
                        label: 'Auth',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login'],
                            },
                            {
                                label: 'Error',
                                routerLink: ['/auth/error'],
                            },
                            {
                                label: 'Access Denied',
                                routerLink: ['/auth/access'],
                            },
                        ],
                    },
                    {
                        label: 'Not Found',
                        routerLink: ['/pages/notfound'],
                    },
                    {
                        label: 'Empty',
                        routerLink: ['/pages/empty'],
                    },
                ],
            },
            {
                label: 'Form',
                routerLink: ['/form'],
                items: [
                    {
                        label: 'Input',
                        routerLink: ['/form/input'],
                    },
                    {
                        label: 'Select',
                        routerLink: ['/form/select'],
                    },
                    {
                        label: 'Checkbox',
                        routerLink: ['/form/checkbox'],
                    },
                    {
                        label: 'radio button',
                        routerLink: ['/form/radio'],
                    },
                ],
            },
            {
                label: 'Files Upload',
                routerLink: ['/upload'],
                items: [
                    {
                        label: 'File upload',
                        routerLink: ['/upload/file'],
                    },
                ],
            },
        ];
    }

    model: MenuItem[] = [];
}
