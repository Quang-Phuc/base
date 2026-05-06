import { CanActivateFn } from '@angular/router';

export const initGuard: CanActivateFn = (route, state) => {
    return true;
};
