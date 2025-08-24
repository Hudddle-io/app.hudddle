import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import NavigationLink from "@/components/basics/Navigation-link";
import axios from "axios";
import { backendUri } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
import { getRouter } from "@/hooks/useRoute";
import { FriendData } from "."; // Assuming FriendData is correctly imported

interface HeaderProps {
  friends: FriendData[]; // Now using the friends data passed as a prop
  name: string;
  isInWorkroom: boolean;
  teamName: string;
  companyName: string;
}

const Header: React.FC<HeaderProps> = ({
  friends, // Destructure friends from props
  name,
  isInWorkroom,
  teamName,
  companyName,
}) => {
  const [newRoomId, setNewRoomId] = useState<string | null>(null);
  const router = getRouter();

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    const workroomData = {
      name: "Untitled Room",
      kpis: "",
      performance_metrics: [],
      friend_emails: [],
    };

    try {
      const response = await axios.post(
        `${backendUri}/api/v1/workrooms`,
        workroomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Clear any existing room ID in localStorage
        localStorage.removeItem("roomId");

        // Store the new room ID in localStorage
        const roomId = response.data.id;
        localStorage.setItem("roomId", roomId);
        setNewRoomId(roomId);
        toast({
          description: "Workroom created successfully!",
        });

        // Route to the /create/{roomId} page
        router.push(`/workroom/create/${roomId}`);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: string }; message?: string };
      console.error(
        "Error creating workroom:",
        err.response?.data || err.message
      );
      toast({
        description: "Failed to create workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the first three friends from the props
  const firstThreeFriends = friends.slice(0, 3);

  return (
    <header>
      <Card
        className={`border-0 p-0 bg-transparent flex flex-col md:flex-row items-end ${
          !isInWorkroom ? "justify-between gap-0" : "justify-start gap-10"
        } shadow-none`}
      >
        <CardHeader className="p-0">
          <SubHeading
            className={`text-primary-hudddle !text-base ${
              isInWorkroom ? "font-bold" : "font-semibold"
            }`}
          >
            {!isInWorkroom ? formatDate() : companyName}
          </SubHeading>
          {!isInWorkroom ? (
            <MainHeading className="text-primary-hudddle font-light">
              Welcome, <span className="font-semibold">{name}</span>
            </MainHeading>
          ) : (
            <h1 className="text-3xl text-custom-semiBlack font-semibold">
              {teamName}
            </h1>
          )}
        </CardHeader>
        <CardContent className="flex gap-4 p-0">
          {!isInWorkroom ? (
            <>
              <div className="flex flex-col p-0 items-end text-custom-semiBlack">
                {firstThreeFriends.length > 0 ? ( // Conditional rendering based on friends array
                  <>
                    <div className="flex items-center gap-1">
                      {/* Map over the first three friends */}
                      {firstThreeFriends.map((friend) => (
                        <TooltipProvider key={friend.id}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Avatar className="w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)]">
                                <AvatarImage
                                  src={
                                    friend.avatar_url ||
                                    "/assets/profileImage.svg"
                                  } // Use friend's avatar_url, with a fallback
                                  loading="lazy"
                                  alt={`${friend.first_name} ${friend.last_name}'s profile`}
                                />
                                {/* Use first initial and last initial for fallback */}
                                <AvatarFallback>
                                  {friend.first_name
                                    ? friend.first_name[0]
                                    : ""}
                                  {friend.last_name ? friend.last_name[0] : ""}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            {/* Display full name in tooltip */}
                            <TooltipContent>
                              {`${friend.first_name || ""} ${
                                friend.last_name || ""
                              }`}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    {/* Updated text */}
                    <p className="text-xs">Your Friends are waiting for you</p>
                  </>
                ) : (
                  // Render when friends array is empty
                  <div className="flex flex-col items-end gap-2">
                    <NavigationLink
                      href="/friends"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Add Friends to Start
                    </NavigationLink>
                    <p className="text-xs">Add friends for collaboration</p>
                  </div>
                )}
              </div>
              <NavigationLink
                onClick={handleCreateRoom}
                className="bg-[#956FD6] text-xl shadow-md"
                icon={{
                  icon_component: <Globe size={10} />,
                  icon_position: "right",
                }}
                loadingText="Creating ..."
              >
                Create workroom
              </NavigationLink>
            </>
          ) : (
            <p className="text-sm font-semibold text-custom-semiBlack">
              {formatDate()}
            </p>
          )}
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
