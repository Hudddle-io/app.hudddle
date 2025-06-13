// components/pages/friends/header.tsx
"use client";

import NavigationLink from "@/components/basics/Navigation-link";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // No longer needed directly here
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import SuggestionBox from "@/components/basics/suggestion-box"; // Make sure path is correct

interface FriendsHeaderProps {
  searchPage?: boolean;
  onFriendRequestSent?: () => void;
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({
  searchPage,
  onFriendRequestSent,
}) => {
  // This state will now directly control the input inside SuggestionBox
  const [searchId, setSearchId] = useState<string>("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
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
      onFriendRequestSent?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // This callback is now used to update searchId from SuggestionBox
  const handleSuggestionSelect = (email: string) => {
    setSearchId(email);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-10 w-full">
        <h1 className="text-3xl text-custom-semiBlack font-semibold">
          Friends
        </h1>
        {/* SuggestionBox is now responsible for its own input field */}
        {!searchPage && (
          <SuggestionBox
            value={searchId} // Pass the current searchId to SuggestionBox
            onValueChange={setSearchId} // New prop: callback to update searchId
            onSuggestionSelect={handleSuggestionSelect} // Existing prop
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
        <Button className="text-custom-semiBlack font-bold text-lg hover:bg-transparent bg-transparent hover:text-custom-purple">
          Add a Friend
        </Button>
      )}
    </div>
  );
};

export default FriendsHeader;
