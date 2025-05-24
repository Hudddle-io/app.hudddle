// components/pages/friends/header.tsx
"use client";

import NavigationLink from "@/components/basics/Navigation-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FriendsHeaderProps {
  searchPage?: boolean;
  onFriendRequestSent?: () => void; // Made optional
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({
  searchPage,
  onFriendRequestSent,
}) => {
  const [searchId, setSearchId] = useState<string>("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter(); // Not used in this component, can be removed if not needed
  const { toast } = useToast();

  const sendFriendRequest = async () => {
    if (searchId === "" || !emailRegex.test(searchId)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User not logged in.");

      // const { id: sender_id } = JSON.parse(storedUser); // sender_id is not used in the payload, can be removed
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token missing.");

      const response = await fetch(
        `${backendUri}/api/v1/friends/friends/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver_email: searchId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send friend request.");
      }

      toast({
        title: "Friend Request Sent",
        description: `Request sent to ${searchId}`,
      });
      setSearchId(""); // Clear the input field after successful send
      onFriendRequestSent?.(); // Conditionally call onFriendRequestSent
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-10 w-full">
        <h1 className="text-3xl text-custom-semiBlack font-semibold">
          Friends
        </h1>
        {!searchPage && (
          <Input
            placeholder="Search by email"
            type="search"
            className="w-[500px] py-6 placeholder:font-bold focus-visible:ring-custom-purple"
            value={searchId} // Control the input value with state
            onChange={(e) => setSearchId(e.target.value)}
          />
        )}
      </div>
      {!searchPage ? (
        <NavigationLink
          icon={{
            icon_component: <Plus size={18} className="mr-2" />,
            icon_position: "left",
          }}
          className="text-black bg-custom-yellow hover:text-white"
          onClick={sendFriendRequest}
        >
          Add a Friend
        </NavigationLink>
      ) : (
        // This button seems to be for a different flow if searchPage is true,
        // it doesn't trigger sendFriendRequest.
        <Button className="text-custom-semiBlack font-bold text-lg hover:bg-transparent bg-transparent hover:text-custom-purple">
          Add a Friend
        </Button>
      )}
    </div>
  );
};

export default FriendsHeader;
