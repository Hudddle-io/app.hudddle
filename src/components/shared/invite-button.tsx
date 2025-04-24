'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useNotification } from './notification-cards';

interface InviteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  notificationType: 'copyLink' | 'success';
}

const InviteButton: React.FC<InviteButtonProps> = ({ children, className, disabled, notificationType, ...props }) => {
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
      <Button
        className={`w-[330px] bg-[#956FD699] mt-10 ${className}`}
        onClick={handleShowNotification}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
      <NotificationComponent />
    </>
  );
};

export default InviteButton;
