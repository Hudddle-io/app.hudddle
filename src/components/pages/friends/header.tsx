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
import { useNotification } from "@/components/shared/notification-cards";

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
  const { showNotification, NotificationComponent } = useNotification();

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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          (data as any)?.detail ||
          (data as any)?.message ||
          (data as any)?.error ||
          "Failed to send friend request.";

        // If the recipient doesn't exist, show an invite modal instead of an auth error.
        if (
          response.status === 404 ||
          /not found|does not exist|doesn't exist|no user/i.test(String(detail))
        ) {
          showNotification({ type: "copyLink" });
          return;
        }

        // Only treat actual auth failures as "not logged in" situations.
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authorization failed. Please log in again.");
        }

        throw new Error(String(detail));
      }

      // Some backends return success with is_new_user=true (invitation flow).
      // In that case we want to show the invite modal with a copyable link.
      const status = (data as any)?.status;
      const isNewUser = Boolean((data as any)?.is_new_user);
      const inviteUrlFromBackend =
        (data as any)?.invite_url ||
        (data as any)?.inviteUrl ||
        (data as any)?.invite_link ||
        (data as any)?.inviteLink ||
        (data as any)?.invitation_link ||
        (data as any)?.invitationLink ||
        (data as any)?.link;

      if (isNewUser || status === "invitation_sent") {
        const fallbackInviteUrl = `${
          window.location.origin
        }/auth/sign-up?email=${encodeURIComponent(searchId)}`;
        showNotification({
          type: "copyLink",
          inviteUrl: inviteUrlFromBackend || fallbackInviteUrl,
        });
        setSearchId("");
        onFriendRequestSent?.();
        return;
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
      <NotificationComponent />
      <div className="flex items-center gap-8 w-full">
        <h1 className="text-3xl text-custom-semiBlack font-semibold">
          Friends
        </h1>
        {/* SuggestionBox is now responsible for its own input field */}
        {!searchPage && (
          <SuggestionBox
            className="max-w-none w-[360px]"
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
