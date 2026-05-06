import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface ILoadingStore {
    isLoading: boolean;
}

const initialState: ILoadingStore = {
    isLoading: false,
};

export const LoadingStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        offLoading(): void {
            patchState(store, () => ({ isLoading: false }));
        },
        onLoading(): void {
            patchState(store, () => ({ isLoading: true }));
        },
    })),
);
