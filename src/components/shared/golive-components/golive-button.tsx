'use client'
import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { startCountdownAsync } from '@/store/slice/counterSlice';
import { AppDispatch } from '@/store/store';

const GoliveButton = () => {
    const dispatch: AppDispatch = useDispatch();

    const handleClick = () => {
        dispatch(startCountdownAsync());
    };

    return (
        <Button className="absolute -bottom-28 right-0 px-24 py-[8px] bg-[#EEAE05]" onClick={handleClick}>
            Go live !
        </Button>
    );
}

export default GoliveButton;