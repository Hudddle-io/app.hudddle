// components/pages/friends/friend-card.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";

interface FriendProps {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email: string;
}

interface WorkroomMember {
  name: string;
  avatar_url: string | null;
}

interface Workroom {
  id: string;
  title: string;
  created_by: string;
  members: WorkroomMember[];
}

// Define the shape of the expected API response
interface WorkroomsApiResponse {
  workrooms: Workroom[];
  total_workrooms: number;
}

interface FriendCardProps {
  friend: FriendProps;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  const [open, setOpen] = useState(false);
  const [workrooms, setWorkrooms] = useState<Workroom[]>([]);
  const [loadingWorkrooms, setLoadingWorkrooms] = useState(false);
  const [inviting, setInviting] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchWorkrooms = async () => {
    if (workrooms.length > 0 && !loadingWorkrooms) {
      return;
    }
    setLoadingWorkrooms(true);

    const token = getToken();
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please log in.",
        variant: "destructive",
      });
      setLoadingWorkrooms(false);
      return;
    }

    try {
      const response = await fetch(`${backendUri}/api/v1/workrooms/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Failed",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          // Optionally, redirect to login page
        }
        throw new Error("Failed to fetch workrooms");
      }
      // Explicitly type the parsed JSON response
      const responseData: WorkroomsApiResponse = await response.json();

      // --- SPECIFIC FIX FOR YOUR DATA STRUCTURE ---
      if (responseData && Array.isArray(responseData.workrooms)) {
        setWorkrooms(responseData.workrooms);
      } else {
        console.warn(
          "API response for workrooms was not in the expected format:",
          responseData
        );
        setWorkrooms([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching workrooms:", error);
      toast({
        title: "Error",
        description: "Failed to load workrooms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingWorkrooms(false);
    }
  };

  const handleInviteToWorkroom = async (
    workroomId: string,
    workroomTitle: string
  ) => {
    setInviting((prev) => ({ ...prev, [workroomId]: true }));

    const token = getToken();
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please log in.",
        variant: "destructive",
      });
      setInviting((prev) => ({ ...prev, [workroomId]: false }));
      return;
    }

    try {
      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emails: [friend.email] }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Failed",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to invite member");
      }

      setWorkrooms((prevWorkrooms) =>
        prevWorkrooms.map((workroom) =>
          workroom.id === workroomId
            ? {
                ...workroom,
                members: [
                  ...workroom.members,
                  {
                    name: `${friend.first_name} ${friend.last_name}`,
                    avatar_url: friend.avatar_url || null,
                  },
                ],
              }
            : workroom
        )
      );

      toast({
        title: "Success",
        description: `${friend.first_name} ${friend.last_name} has been invited to ${workroomTitle}.`,
      });
    } catch (error: any) {
      console.error("Error inviting to workroom:", error);
      toast({
        title: "Error",
        description: `Failed to invite ${friend.first_name} to ${workroomTitle}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setInviting((prev) => ({ ...prev, [workroomId]: false }));
    }
  };

  const isMemberAlreadyAdded = (workroom: Workroom) => {
    const friendFullName = `${friend.first_name} ${friend.last_name}`;
    return workroom.members.some((member) => member.name === friendFullName);
  };

  return (
    <Card className="rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke bg-transparent hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        friend.avatar_url ||
                        `https://placehold.co/48x48/E0E0E0/333333?text=${
                          friend && friend.first_name.slice(0, 1).toUpperCase()
                        }` ||
                        "name"
                      }
                      loading="lazy"
                      alt={friend.first_name}
                    />
                    <AvatarFallback className="text-[0.5rem]">
                      {friend.first_name.slice(0, 1).toUpperCase()}
                      {friend.last_name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  {friend.first_name} {friend.last_name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardTitle className="text-slate-600 text-lg p-0">
              {friend.first_name} {friend.last_name}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {friend.email}
          </CardDescription>
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end p-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              className="bg-custom-purple"
              onClick={fetchWorkrooms}
              disabled={loadingWorkrooms}
            >
              {loadingWorkrooms ? (
                "Loading..."
              ) : (
                <>
                  <Plus size={18} className="mr-2" /> Invite to workroom
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            {loadingWorkrooms ? (
              <div className="p-4 text-center">Loading workrooms...</div>
            ) : workrooms.length === 0 ? (
              <div className="p-4 text-center">No workrooms available.</div>
            ) : (
              <div className="h-fit max-h-48 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {workrooms.map((workroom) => (
                    <li
                      key={workroom.id}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                        isMemberAlreadyAdded(workroom)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        !isMemberAlreadyAdded(workroom) &&
                        !inviting[workroom.id] &&
                        handleInviteToWorkroom(workroom.id, workroom.title)
                      }
                    >
                      <span>{workroom.title}</span>
                      {isMemberAlreadyAdded(workroom) ? (
                        <span className="text-xs text-green-600">Added</span>
                      ) : inviting[workroom.id] ? (
                        <span className="text-xs text-blue-500">
                          Inviting...
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </Card>
  );
};

export default FriendCard;
