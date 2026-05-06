import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isDevMode } from '@angular/core';

async function prepareApp() {
    if (isDevMode() && Boolean(JSON.parse(localStorage.getItem('enableMock') ?? 'false'))) {
        const { worker } = await import('./app/mock/browser');
        return worker.start();
    }

    return Promise.resolve();
}

prepareApp().then(() => {
    bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});
