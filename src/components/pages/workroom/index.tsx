"use client";
// className="bg-transparent shadow-none ring-0 border-0"
//    className="aspect-auto h-[160px] w-[600px]"
//  fill="#956fd670"
import React, { useState, useMemo, useEffect } from "react";
import { Metadata } from "next";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavigationLink from "@/components/basics/Navigation-link";
import { getToken } from "@/utils";
import { backendUri } from "@/lib/config";
import WorkroomsLoader, {
  RecentWorkroomsLoader,
} from "@/components/loaders/workrooms";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const BulletedList = "/assets/bulleted.svg";
const Trash = "/assets/trash.svg";

type Props = {};

export const metadata: Metadata = {
  title: "Hudddle | Workrooms",
};

const WorkroomPage = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newRoomId, setNewRoomId] = useState<string | null>(null);

  const [roomsData, setRoomsData] = useState<any[]>([]); // will use API schema
  const router = useRouter();

  // Simulated current user ID from token
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();

    const fetchUserIdFromToken = async () => {
      if (!token) return;

      // Example: decode token to get user id
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId); // assuming your token contains this
    };

    const fetchWorkrooms = async () => {
      try {
        if (!token) {
          console.error("No token found");
          return;
        }

        setLoading(true);

        const response = await fetch(`${backendUri}/api/v1/workrooms/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch workrooms", response.status);
          return;
        }

        const data = await response.json();

        // Adjusting to use the expected API response structure
        const workrooms = (data.workrooms || []).map((room: any) => ({
          id: room.id,
          name: room.title || "Untitled Room", // Default to "Untitled Room" if title is missing
          createdBy: room.created_by || "Unknown", // Default to "Unknown" if created_by is missing
          users: room.members || [], // Default to an empty array if members are missing
          isActive: false, // Assuming isActive is not provided in the API response
        }));

        setRoomsData(workrooms);
      } catch (error) {
        console.error("Error fetching workrooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdFromToken();
    fetchWorkrooms();
  }, []);

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
    } catch (error) {
      toast({
        description: "Failed to create workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkroom = async (workroomId: string) => {
    const token = getToken();
    setDeleting(true);
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete workroom");
      }

      toast({
        description: "Workroom deleted successfully!",
      });

      // Refresh the workrooms
      const fetchWorkrooms = async () => {
        const response = await fetch(`${backendUri}/api/v1/workrooms/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch workrooms");
        }

        const data = await response.json();
        const workrooms = (data.workrooms || []).map((room: any) => ({
          id: room.id,
          name: room.title || "Untitled Room",
          createdBy: room.created_by || "Unknown",
          users: room.members || [],
          isActive: false,
        }));

        setRoomsData(workrooms);
      };

      await fetchWorkrooms();
      router.refresh();
      setDeleting(false);
    } catch (error) {
      console.error("Error deleting workroom:", error);
      toast({
        description: "Failed to delete workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  // NEW: handleEdit function
  const handleEditWorkroom = (workroomId: string) => {
    router.push(`/workroom/edit/${workroomId}`);
  };

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return roomsData;
    return roomsData.filter((room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, roomsData]);

  return (
    <main className="py-12 px-10 flex flex-col gap-4">
      <header className="flex w-full justify-between items-center">
        <MainHeading variant="secondary">Workrooms</MainHeading>
        <div className="flex items-center gap-[clamp(0.625rem,_0.8547vw,_1.25rem)]">
          <Button className="w-[clamp(9.375rem,_5.4701vw,_13.375rem)] rounded-[16px] bg-white text-[#956FD6] shadow">
            {roomsData.length} Workrooms
          </Button>
          <Button className="w-[clamp(6.25rem,_4.8718vw,_9.8125rem)] rounded-[16px] bg-white text-[#956FD6] shadow">
            {roomsData.filter((room) => room.isActive).length} Active
          </Button>
          <NavigationLink
            onClick={handleCreateRoom}
            icon={{
              icon_component: <Plus size={24} color="white" />,
              icon_position: "left",
            }}
          >
            Create Workroom
          </NavigationLink>
        </div>
      </header>

      <section id="active-workroom" className="w-full flex flex-col gap-2">
        <header className="w-full flex items-center justify-between">
          <SubHeading>You&apos;re presently working on</SubHeading>
          <Button variant="ghost" size="icon">
            <Image src={BulletedList} alt="list" width={16} height={16} />
          </Button>
        </header>

        {roomsData[0] ? (
          <div className="w-full h-[clamp(6.25rem,_3.6752vh,_8.9375rem)] rounded-[16px] card-morph border border-[#956FD6] py-1 px-4 flex flex-col justify-between">
            <section className="flex justify-between">
              <div className="flex items-start flex-col gap-1">
                <MainHeading variant="bigCardTitle">
                  {roomsData[0].name}
                </MainHeading>
                {/* Updated Link to use handleEditWorkroom */}
                <Button
                  variant="ghost"
                  className="text-[#956FD6] text-xs p-0 h-0"
                  onClick={() => handleEditWorkroom(roomsData[0].id)}
                >
                  Edit workroom
                </Button>
              </div>
              {roomsData[0].isActive && (
                <div className="w-4 h-4 bg-[#ADD359] animate-pulse rounded-full" />
              )}
            </section>
            <section className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="flex gap-1">
                  {roomsData[0].users
                    ?.slice(0, 3)
                    .map((user: any, idx: number) => (
                      <div
                        key={idx}
                        className="w-6 h-6 bg-black rounded-full relative"
                      >
                        <Image
                          src={user.avatar_url}
                          className="rounded-full object-cover"
                          alt="user-img"
                          fill
                        />
                      </div>
                    ))}
                </span>
                <p className="text-sm text-[#999999]">
                  {roomsData[0].users?.map((u: any) => u.fullname).join(", ")}{" "}
                  are in this workroom
                </p>
              </div>
              <div className="flex items-center gap-2">
                <NavigationLink
                  href={`/workroom/room/${roomsData[0].id}`}
                  variant={"outline"}
                  className="h-7 text-sm rounded-[6px] ring-[#211451] shadow-none"
                >
                  join Workroom
                </NavigationLink>
                <Button variant="ghost" size="icon" className="w-fit p-0 h-0">
                  <Image src={Trash} alt="trash" width={13} height={15} />
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <RecentWorkroomsLoader />
        )}
      </section>

      <section className="w-full pt-4">
        <Tabs defaultValue="workroom" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="workroom">workroom</TabsTrigger>
              <TabsTrigger value="created">created by you</TabsTrigger>
              <TabsTrigger value="shared">shared workrooms</TabsTrigger>
            </TabsList>
            <Input
              type="search"
              placeholder="search rooms"
              className="h-9 w-[clamp(12.5rem,_15.6239vw,_21rem)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <WorkroomsLoader />
          ) : (
            <TabsContent
              value="workroom"
              className="w-full grid grid-cols-2 gap-4"
            >
              {filteredRooms.map((room, index) => {
                const isCreatedByYou = room.createdBy?._id === currentUserId;

                return (
                  <div
                    key={index}
                    className="rounded-[16px] shadow-lg py-1 px-4 h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] flex flex-col justify-between hover:border hover:border-[#956FD6] "
                  >
                    <header className="flex justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <MainHeading variant="smallCardTitle">
                          {room.name}
                        </MainHeading>
                        {isCreatedByYou ? (
                          // Updated Link to use handleEditWorkroom
                          <Button
                            variant="ghost"
                            className="text-[#956FD6] text-xs p-0 h-0"
                            onClick={() => handleEditWorkroom(room.id)}
                          >
                            Edit workroom
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Created by {room.createdBy?.fullname || "someone"}
                          </span>
                        )}
                      </div>
                      {room.isActive && (
                        <div className="w-4 h-4 bg-[#ADD359] animate-pulse rounded-full" />
                      )}
                    </header>
                    <footer className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-[#999999]">
                          {room.users?.length > 0
                            ? `${room.users.length} people in this workroom`
                            : "No one is in this workroom"}
                        </p>
                        <NavigationLink
                          href={`/workroom/room/${room.id}`}
                          variant={"outline"}
                          className="h-7 text-sm rounded-[6px] ring-[#211451] shadow-none"
                        >
                          Open Workroom
                        </NavigationLink>
                      </div>
                      <Button
                        id="delete-btn-workrooms"
                        variant="ghost"
                        disabled={deleting}
                        className="p-0 h-0"
                        onClick={() => handleDeleteWorkroom(room.id)}
                      >
                        {deleting ? (
                          <div className="flex items-center gap-2 text-red-500">
                            <Loader2 className="animate-spin h-2 w-2" />
                            Deleting room ...
                          </div>
                        ) : (
                          <Image
                            src={Trash}
                            alt="trash"
                            width={13}
                            height={15}
                          />
                        )}
                      </Button>
                    </footer>
                  </div>
                );
              })}
            </TabsContent>
          )}
        </Tabs>
      </section>
    </main>
  );
};

export default WorkroomPage;
