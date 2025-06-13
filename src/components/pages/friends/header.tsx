// components/pages/friends/header.tsx
"use client";

import NavigationLink from "@/components/basics/Navigation-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Corrected path assumption
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import SuggestionBox from "@/components/basics/suggestion-box";

interface FriendsHeaderProps {
  searchPage?: boolean;
  onFriendRequestSent?: () => void; // Made optional
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({
  searchPage,
  onFriendRequestSent,
}) => {
  const [searchId, setSearchId] = useState<string>(""); // This state controls the main input
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter(); // If not used, can be removed
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
      onFriendRequestSent?.(); // Conditionally call onFriendRequestSent
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // Callback function to handle suggestion selection
  const handleSuggestionSelect = (email: string) => {
    setSearchId(email); // Update the main input's state with the selected email
    // Optionally, you might want to hide the suggestion box immediately after selection
    // This is handled internally by SuggestionBox's blur/focus, but you could force it here.
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-10 w-full">
        <h1 className="text-3xl text-custom-semiBlack font-semibold">
          Friends
        </h1>
        {/* The main search input for friend requests */}
        {/* This input is no longer controlling the search for suggestions.
            It simply displays the 'searchId' state */}
        {!searchPage && (
          <div className="flex flex-col items-center gap-2">
            <Input
              placeholder="Search by email"
              type="search"
              className="w-[500px] py-6 placeholder:font-bold focus-visible:ring-custom-purple"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <SuggestionBox
              value={searchId} // Pass the current searchId to SuggestionBox
              onSuggestionSelect={handleSuggestionSelect} // Pass the callback
            />
          </div>
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
      {/* SuggestionBox is now responsible for its own input and fetching.
          It receives the current searchId value and a callback to update it. */}
      {/* The `data` prop is still there but remains unused in SuggestionBox based on previous logic */}
    </div>
  );
};

export default FriendsHeader;
