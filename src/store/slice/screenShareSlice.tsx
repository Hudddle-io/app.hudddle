import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface ScreenShareState {
    isSharing: boolean;
    startTime: number | null;
    endTime: number | null;
    duration: number; // duration in milliseconds
}

const initialState: ScreenShareState = {
    isSharing: false,
    startTime: null,
    endTime: null,
    duration: 0,
};

const screenShareSlice = createSlice({
    name: 'screenShare',
    initialState,
    reducers: {
        startSharing: (state) => {
            state.isSharing = true;
            state.startTime = Date.now();
            state.endTime = null;
            state.duration = 0;
        },
        stopSharing: (state) => {
            state.isSharing = false;
            state.endTime = Date.now();
            if (state.startTime) {
                state.duration = state.endTime - state.startTime;
            }
        },
        updateDuration: (state) => {
            if (state.startTime) {
                state.duration = Date.now() - state.startTime;
            }
        },
    },
});

export const { startSharing, stopSharing, updateDuration } = screenShareSlice.actions;

export const startSharingAsync = () => (dispatch: AppDispatch) => {
    dispatch(startSharing());
    const intervalId = setInterval(() => {
        dispatch(updateDuration());
    }, 1000);

    return () => clearInterval(intervalId);
};

export const stopSharingAsync = () => (dispatch: AppDispatch) => {
    dispatch(stopSharing());
};

export default screenShareSlice.reducer;
