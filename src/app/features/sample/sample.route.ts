import { Route } from '@angular/router';

export const Routes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./crud-sample/crud-sample').then((m) => m.CrudSample),
    },
];
