// src/mocks/browser.ts

// Set up the worker and register the handlers
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
