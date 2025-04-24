import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './slice/counterSlice';
import screenShareReducer from './slice/screenShareSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        screenShare: screenShareReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
