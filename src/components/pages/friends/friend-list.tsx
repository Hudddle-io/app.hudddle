"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import TabSwitch from "./tab-switch";
import FriendCard from "./friend-card";
import PendingCard from "./pending-card";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/shared/loading-page";

interface FriendsPageProps {
  tab: string;
  page: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

const FriendList: React.FC<FriendsPageProps> = ({ tab, page }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = Number(process.env.NEXT_PUBLIC_PAGINATION_PER_PAGE) || 4;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = friends.slice(startIndex, endIndex);
  const totalPages = Math.ceil(friends.length / itemsPerPage);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/friends/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch friends");
        }

        const data = await res.json();
        setFriends(data.friends || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <LoadingPage loadingText="Getting your friends" />;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  return (
    <>
      <TabSwitch currentTab={tab} />
      <Card className="mt-5 p-4 border-none neo-effect">
        {tab === "all-friends" ? (
          currentData.length > 0 ? (
            currentData.map((profile) => (
              <FriendCard friend={profile} key={profile.id} />
            ))
          ) : (
            <div className="py-40 grid place-content-center">
              <p className="text-center">You have no friends yet</p>
              <Button className="w-[330px] bg-[#956FD699] mt-8">
                Invite friend
              </Button>
            </div>
          )
        ) : currentData.length > 0 ? (
          currentData.map((profile) => (
            <PendingCard pending={profile} key={profile.id} />
          ))
        ) : (
          <div className="py-40 grid place-content-center">
            <p className="text-center">You have no pending invites</p>
          </div>
        )}
      </Card>
      <div className="flex justify-center items-center mt-20">
        {currentData.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            baseUrl="/friends"
            tab={tab}
          />
        )}
      </div>
    </>
  );
};

export default FriendList;
