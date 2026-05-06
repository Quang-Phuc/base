import { Routes } from '@angular/router';
import { AppLayout } from './core/layout/components/app.layout';
import { Dashboard } from '@features/dashboard/dashboard';
import { Notfound } from '@features/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'pages', loadChildren: () => import('../app/features/pages.routes') },
            { path: 'form', loadChildren: () => import('../app/features/form/form.routes') },
            { path: 'upload', loadChildren: () => import('../app/features/upload-doc/upload.routes') },
        ],
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('../app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' },
];
