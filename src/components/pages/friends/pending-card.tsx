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
import { X } from "lucide-react";

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
  onAccept: (senderEmail: string) => Promise<void>; // Callback for accepting
  onDecline: (requestId: string) => Promise<void>; // Callback for declining, expects request ID
}

const PendingCard: React.FC<PendingProps> = ({
  pending,
  onAccept,
  onDecline,
}) => {
  const [isDeclining, setIsDeclining] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const displayName =
    pending.first_name && pending.last_name
      ? `${pending.first_name} ${pending.last_name}`
      : pending.sender_email || pending.email || "";

  const displayEmail = pending.sender_email || pending.email || "";

  const handleDeclineClick = async () => {
    setIsDeclining(true);
    await onDecline(pending.id); // Assuming pending.id is the request ID for decline
    setIsDeclining(false);
  };

  const handleAcceptClick = async () => {
    setIsAccepting(true);
    await onAccept(pending.sender_email || pending.email || "");
    setIsAccepting(false);
  };

  return (
    <Card className="rounded-none shadow-none bg-transparent py-4 border-x-0 border-0 hover:bg-custom-whitesmoke px-0 items-center grid grid-cols-9">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0 w-full pb-5 hover:border-b-custom-purple border-b-[1px] border-b-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
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
              {displayName}
            </CardTitle>
            <p className="text-xs text-muted-foreground ml-3">Pending</p>
          </div>
          {displayEmail && (
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          )}
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end gap-2 p-0">
        <Button
          className="bg-primary-hudddle hover:bg-primary-hudddle/90 text-white px-4"
          onClick={handleAcceptClick}
          disabled={isAccepting}
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white px-4"
          onClick={handleDeclineClick}
          disabled={isDeclining}
        >
          {isDeclining ? "Canceling..." : "Cancel invite"}
          {!isDeclining && <X size={16} className="ml-2" />}
        </Button>
      </div>
    </Card>
  );
};

export default PendingCard;
