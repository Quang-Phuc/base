import { Routes } from '@angular/router';

export default [
    {
        path: 'sample-crud',
        loadChildren: () => import('./sample/sample.route').then((m) => m.Routes),
    },
    // Thêm route cho trang quản lý SEO & Facebook Automation
    {
        path: 'news-management',
        loadComponent: () => import('./news/news-management.component').then((m) => m.NewsManagementComponent),
    },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
