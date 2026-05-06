import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withFetch,
    withInterceptors,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { coreInterceptor } from './core/interceptor/core-interceptor';

registerLocaleData(localeVi);
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        provideClientHydration(withEventReplay()),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(
            withFetch(),
            // 1. Dùng withInterceptors() để đăng ký interceptor dạng function
            withInterceptors([coreInterceptor]),

            // 2. Bỏ cả withInterceptorsFromDi() và provider HTTP_INTERCEPTORS cũ
        ),
        provideAnimationsAsync(),

        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        { provide: LOCALE_ID, useValue: 'vi-VN' },
    ],
};
