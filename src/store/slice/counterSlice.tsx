import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from "@/store/store";

interface CounterState {
    value: number;
    isVisible: boolean;
    countdownComplete: boolean;
}

const initialState: CounterState = {
    value: 3,
    isVisible: false,
    countdownComplete: false,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        startCountdown: (state) => {
            state.isVisible = true;
            state.value = 3;
            state.countdownComplete = false;
        },
        decrement: (state) => {
            if (state.value > 1) {
                state.value -= 1;
            } else {
                state.countdownComplete = true;
            }
        },
        hideOverlay: (state) => {
            state.isVisible = false;
        },
    },
});

export const { startCountdown, decrement, hideOverlay } = counterSlice.actions;

export const startCountdownAsync = () => (dispatch: AppDispatch) => {
    dispatch(startCountdown());
    let count = 3;
    const countdownInterval = setInterval(() => {
        if (count > 1) {
            dispatch(decrement());
            count--;
        } else {
            clearInterval(countdownInterval);
            dispatch(decrement()); 
        }
    }, 1000);
};

export default counterSlice.reducer;
