'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideOverlay } from '@/store/slice/counterSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useToast } from '@/components/ui/use-toast';
import { startSharingAsync, stopSharingAsync } from '@/store/slice/screenShareSlice';

const SelectScreenPopup = () => {
    const [golive, setGolive] = useState<boolean>(false);
    const [active, setActive] = useState<number | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const { toast } = useToast();
    const { isSharing, startTime, endTime, duration } = useSelector((state: RootState) => state.screenShare);

    const handleSelectBox = (index: number) => {
        setActive(index);
        setGolive(true);
    };

    const handleCardClick = (event: React.MouseEvent) => {
        if ((event.target as HTMLElement).closest('.box')) return;
        setActive(null);
        setGolive(false);
    };

    const handleClose = () => {
        dispatch(hideOverlay());
    };

    const handleGoLive = async () => {
        if (active === null) return;
        try {
            let stream: MediaStream | null = null;
            if (active === 0) {
                // Share Chrome Tab
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        displaySurface: 'browser',
                    },
                });
            } else if (active === 1) {
                // Share Window
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        displaySurface: 'window',
                    },
                });
            } else if (active === 2) {
                // Share Entire Screen
                stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        displaySurface: 'monitor',
                    },
                });
            }
            if (stream) {
                const stopStream = () => {
                    stream.getTracks().forEach(track => track.stop());
                    dispatch(stopSharingAsync());
                };
                stream.getVideoTracks()[0].addEventListener('ended', stopStream);
                dispatch(startSharingAsync());
                toast({
                    title: "Streaming",
                    description: "Screen sharing has started.",
                });
            }
            dispatch(hideOverlay());
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    };

    return (
        <Card
            className='bg-white p-6 rounded-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-black border-0'
            onClick={handleCardClick}
        >
            <div className='text-slate-500 p-0 m-0 flex justify-end items-end'>
                <X size={24} className='cursor-pointer' onClick={handleClose} />
            </div>
            <h1 className="font-bold text-xl mb-1">Select a screen to share</h1>
            <p>You are about to share your screen. Choose a window you are working in to go live in a workroom.</p>

            <div className='flex py-5 justify-center gap-3'>
                {["Chrome Tab", "Window", "Entire Screen"].map((box, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectBox(index)}
                        className={`box w-[200px] h-[200px] text-xs bg-white hover:border-custom-purple border-2 cursor-pointer ${active === index ? 'border-custom-purple' : 'border-slate-500'} w-[8rem] h-[8rem] rounded-xl grid place-content-center ${active === index ? 'border-blue-500' : ''}`}
                    >
                        {box}
                    </div>
                ))}
            </div>
            <div className='flex justify-center items-center'>
                <Button
                    className={`text-center mx-auto ${golive ? 'bg-custom-yellow' : 'bg-slate-500'} w-[50%]`}
                    disabled={!golive}
                    onClick={handleGoLive}
                >
                    Go live!
                </Button>
            </div>
        </Card>
    );
};
export default SelectScreenPopup;
