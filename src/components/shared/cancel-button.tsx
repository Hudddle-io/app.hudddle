'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useNotification } from './notification-cards';
import friendListData from '@/data/friends';


interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    notificationType: 'copyLink' | 'success' | 'delete';
}

const CancelButton: React.FC<CancelButtonProps> = ({ children, className, disabled,  notificationType, ...props }) => {
    const { showNotification, NotificationComponent } = useNotification();

    const handleShowNotification = () => {
        showNotification({
            type: notificationType,
            // message: notificationType === 'success' ? 'Invite sent successfully!' : '',
            // btnMessage: notificationType === 'success' ? 'Okay, thanks' : ''
        });
    };

    return (
        <>
            <Button onClick={handleShowNotification} disabled={disabled} className={` bg-red-500 ${className}`} {...props}>{children}</Button>
            <NotificationComponent  />
        </>
    );
};

export default CancelButton;
