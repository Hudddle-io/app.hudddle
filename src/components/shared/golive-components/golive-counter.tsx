'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SelectScreenPopup from './select-screen-popup';

const GoLiveCounter = () => {
    const { value, isVisible, countdownComplete } = useSelector((state: RootState) => state.counter);
    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 z-50 grid place-content-center'>
            <div className='bg-black opacity-50 absolute inset-0'></div>
            <div className='relative'>
                {countdownComplete ? (
                    <SelectScreenPopup />
                ) : (
                   <div className='circle'><h1 className='text-center font-extrabold text-white text-[7rem]'>{value}</h1></div>
                )}
            </div>
        </div>
    );
}

export default GoLiveCounter;
