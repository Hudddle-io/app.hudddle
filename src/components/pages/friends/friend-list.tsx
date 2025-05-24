// components/pages/friends/friend-list.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import TabSwitch from "./tab-switch"; // Assuming TabSwitch correctly updates URL search params
import FriendCard from "./friend-card";
import PendingCard from "./pending-card";
import Pagination from "@/components/shared/pagination"; // Assuming Pagination correctly updates URL search params
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/shared/loading-page";
import { useToast } from "@/components/ui/use-toast"; // Added for toast notifications
import { backendUri } from "@/lib/config";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  // Add any other fields relevant for pending requests, e.g., 'sender_id', 'receiver_id'
}

interface FriendListProps {
  tab: string;
  page: number;
  refreshKey: number; // New prop to trigger re-fetching
  onActionComplete: () => void; // Callback to notify parent of action completion
}

const FriendList: React.FC<FriendListProps> = ({
  tab,
  page,
  refreshKey,
  onActionComplete,
}) => {
  const [data, setData] = useState<Friend[]>([]); // Holds either friends or pending requests
  const [totalItems, setTotalItems] = useState(0); // For server-side pagination total count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Define items per page from environment variable or a default
  const itemsPerPage = Number(process.env.NEXT_PUBLIC_PAGINATION_PER_PAGE) || 4;

  // Calculate total pages based on totalItems from backend
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchFriendsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token missing. Please log in.");
      }

      let apiUrl = "";
      if (tab === "all-friends") {
        apiUrl = `${backendUri}/api/v1/friends/friends`;
      } else if (tab === "pending-invites") {
        // Assuming a new tab value for pending invites
        apiUrl = `${backendUri}/api/v1/friends/friends/requests/pending`;
      } else {
        // Handle other tabs or default
        setData([]);
        setTotalItems(0);
        setLoading(false);
        return;
      }

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Failed to fetch ${tab} data.`);
      }

      const responseData = await res.json();
      console.log(responseData); // Debugging line to check the response structure
      // Assuming backend returns an object like { friends: [], total_count: N }
      // Or { pending_requests: [], total_count: N }
      setData(responseData || []);
      setTotalItems(responseData.total_count || 0);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(
        err.message || "An unexpected error occurred while fetching data."
      );
      toast({
        title: "Error",
        description: err.message || "Failed to load data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [tab, toast]); // Add refreshKey to dependencies

  useEffect(() => {
    fetchFriendsData();
  }, [fetchFriendsData]); // Re-fetch when fetchFriendsData callback changes (due to tab, page, refreshKey)

  // Handlers for accepting/declining pending requests
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token missing.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/friends/friends/requests/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ request_id: requestId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to accept friend request.");
      }

      toast({
        title: "Request Accepted",
        description: "Friend request accepted successfully!",
      });
      onActionComplete(); // Trigger refresh
    } catch (err: any) {
      console.error("Error accepting request:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to accept request.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token missing.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/friends/friends/requests/decline`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ request_id: requestId }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to decline friend request.");
      }

      toast({
        title: "Request Declined",
        description: "Friend request declined.",
      });
      onActionComplete(); // Trigger refresh
    } catch (err: any) {
      console.error("Error declining request:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to decline request.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <LoadingPage loadingText={`Getting your ${tab.replace("-", " ")}...`} />
    );
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  return (
    <>
      {/* TabSwitch should update the 'tab' search param in the URL */}
      <TabSwitch currentTab={tab} />
      <Card className="mt-5 p-4 border-none neo-effect">
        {data.length > 0 ? (
          data.map((profile) =>
            tab === "all-friends" ? (
              <FriendCard
                friend={{
                  ...profile,
                  email: profile.email ?? "",
                  first_name: (profile as any).first_name ?? "",
                  last_name: (profile as any).last_name ?? "",
                }}
                key={profile.id}
              />
            ) : (
              // Pass handlers to PendingCard for accept/decline actions
              <PendingCard
                pending={{
                  ...profile,
                  first_name: (profile as any).first_name ?? "",
                  last_name: (profile as any).last_name ?? "",
                }}
                key={profile.id}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            )
          )
        ) : (
          <div className="py-40 grid place-content-center">
            <p className="text-center">
              {tab === "all-friends"
                ? "You have no friends yet"
                : "You have no pending invites"}
            </p>
            {tab === "all-friends" && (
              <Button className="w-[330px] bg-[#956FD699] mt-8">
                Invite friend
              </Button>
            )}
          </div>
        )}
      </Card>
      <div className="flex justify-center items-center mt-20">
        {totalItems > itemsPerPage && ( // Only show pagination if there's more than one page
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            baseUrl="/friends" // Ensure this is the correct base URL for your friends page
            tab={tab}
          />
        )}
      </div>
    </>
  );
};

export default FriendList;
