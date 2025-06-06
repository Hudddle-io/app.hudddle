"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CancelButton from "@/components/shared/cancel-button"; // Assuming this is a generic confirmation button
import { Check, X } from "lucide-react"; // Icons for accept/decline

interface Friend {
  id: string; // The ID of the pending request or the sender's user ID
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email?: string; // This will now be used as the sender_email for acceptance
  sender_email?: string; // Added to potentially receive sender_email if backend provides it directly for pending requests
  // If your backend provides a specific 'request_id' for pending requests,
  // ensure it's included in this interface, e.g., requestId: string;
  // For now, assuming 'id' can serve as the request ID for decline.
}

interface PendingProps {
  pending: Friend;
  onAccept: (senderEmail: string) => void; // Callback for accepting, expects sender's email
  onDecline: (requestId: string) => void; // Callback for declining, expects request ID
}

const PendingCard: React.FC<PendingProps> = ({
  pending,
  onAccept,
  onDecline,
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const handleAcceptClick = async () => {
    setIsAccepting(true);
    // Use pending.sender_email if available, otherwise fallback to pending.email
    await onAccept(pending.sender_email || pending.email || "");
    setIsAccepting(false);
  };

  const handleDeclineClick = async () => {
    setIsDeclining(true);
    await onDecline(pending.id); // Assuming pending.id is the request ID for decline
    setIsDeclining(false);
  };

  return (
    <Card className="rounded-none shadow-none bg-transparent py-4 border-x-0 border-0 hover:bg-custom-whitesmoke px-0 items-center grid grid-cols-9">
      <CardContent className="col-span-6 flex justify-between items-center p-0">
        <div className="space-y-1 p-0 w-full pb-5 hover:border-b-custom-purple border-b-[1px] border-b-slate-300">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        pending.avatar_url ||
                        `https://placehold.co/48x48/E0E0E0/333333?text=${
                          pending.sender_email &&
                          pending.sender_email.slice(0, 1).toUpperCase()
                        }`
                      }
                      loading="lazy"
                      alt="profile"
                    />
                    <AvatarFallback className="text-[0.5rem]">
                      {pending.sender_email &&
                        pending.sender_email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{pending.sender_email}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardTitle className="text-slate-600 text-lg p-0">
              {pending.sender_email}
            </CardTitle>
            <p className="text-xs text-yellow-600 ml-5 italic">Pending</p>
          </div>
        </div>
      </CardContent>
      <div className="col-span-3 flex items-center justify-end p-0 gap-2">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
          onClick={handleAcceptClick}
          disabled={isAccepting || isDeclining}
        >
          {isAccepting ? "Accepting..." : <Check size={18} />}
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          onClick={handleDeclineClick}
          disabled={isAccepting || isDeclining}
        >
          {isDeclining ? "Declining..." : <X size={18} />}
        </Button>
        {/* You might keep CancelButton for other actions if needed, but for accept/decline, direct buttons are better */}
        {/* <CancelButton notificationType="delete">Yes, delete</CancelButton> */}
      </div>
    </Card>
  );
};

export default PendingCard;
