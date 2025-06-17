"use client";
// className="bg-transparent shadow-none ring-0 border-0"
//    className="aspect-auto h-[160px] w-[600px]"
//  fill="#956fd670"
import React, { useState, useMemo, useEffect } from "react";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import NavigationLink from "@/components/basics/Navigation-link";
import { getToken } from "@/utils"; // Assumes getToken safely handles localStorage
import { backendUri } from "@/lib/config";
import WorkroomsLoader, {
  RecentWorkroomsLoader,
} from "@/components/loaders/workrooms";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const BulletedList = "/assets/bulleted.svg";
const Trash = "/assets/trash.svg";

type Props = {};

// Interface for workroom data from "created by me" and "shared" endpoints
interface WorkroomSummary {
  id: string;
  title: string;
  created_by: string;
  members: { name: string; avatar_url: string | null }[];
}

const DefaultAvatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const WorkroomPage = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newRoomId, setNewRoomId] = useState<string | null>(null);

  const [roomsData, setRoomsData] = useState<any[]>([]); // will use API schema
  const router = useRouter();

  // Simulated current user ID from token
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // New states for "Created by You" and "Shared Workrooms" data
  const [createdWorkrooms, setCreatedWorkrooms] = useState<WorkroomSummary[]>(
    []
  );
  const [sharedWorkrooms, setSharedWorkrooms] = useState<WorkroomSummary[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(true);
  const [loadingShared, setLoadingShared] = useState(true);
  const [activeTab, setActiveTab] = useState("workroom"); // State to manage active tab

  useEffect(() => {
    // Safely get token on client side
    const token = typeof window !== "undefined" ? getToken() : null;

    const fetchUserIdFromToken = async () => {
      if (!token) return;

      try {
        // Example: decode token to get user id
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.userId); // assuming your token contains this
      } catch (e) {
        console.error("Error decoding token:", e);
        setCurrentUserId(null);
      }
    };

    const fetchWorkrooms = async () => {
      try {
        if (!token) {
          console.error("No token found");
          setLoading(false); // Ensure loading state is reset
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
          setLoading(false); // Ensure loading state is reset
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
  }, []); // Empty dependency array means this runs once on mount (client-side)

  // Function to fetch "Created by You" workrooms
  const fetchCreatedWorkrooms = async () => {
    setLoadingCreated(true);
    try {
      const token = typeof window !== "undefined" ? getToken() : null;
      if (!token) {
        throw new Error("Authorization token is missing");
      }
      const response = await fetch(
        `${backendUri}/api/v1/workrooms/created-by-me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch created workrooms");
      }
      const data = await response.json();
      setCreatedWorkrooms(data.workrooms || []);
    } catch (error) {
      console.error("Error fetching created workrooms:", error);
      toast({
        description: "Failed to load your created workrooms.",
        variant: "destructive",
      });
    } finally {
      setLoadingCreated(false);
    }
  };

  // Function to fetch "Shared Workrooms"
  const fetchSharedWorkrooms = async () => {
    setLoadingShared(true);
    try {
      const token = typeof window !== "undefined" ? getToken() : null;
      if (!token) {
        throw new Error("Authorization token is missing");
      }
      const response = await fetch(`${backendUri}/api/v1/workrooms/shared`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch shared workrooms");
      }
      const data = await response.json();
      setSharedWorkrooms(data.workrooms || []);
    } catch (error) {
      console.error("Error fetching shared workrooms:", error);
      toast({
        description: "Failed to load shared workrooms.",
        variant: "destructive",
      });
    } finally {
      setLoadingShared(false);
    }
  };

  // useEffect to fetch "Created by You" workrooms when the tab becomes active
  useEffect(() => {
    if (
      activeTab === "created" &&
      createdWorkrooms.length === 0 &&
      loadingCreated
    ) {
      fetchCreatedWorkrooms();
    }
  }, [activeTab, createdWorkrooms.length, loadingCreated]);

  // useEffect to fetch "Shared Workrooms" when the tab becomes active
  useEffect(() => {
    if (
      activeTab === "shared" &&
      sharedWorkrooms.length === 0 &&
      loadingShared
    ) {
      fetchSharedWorkrooms();
    }
  }, [activeTab, sharedWorkrooms.length, loadingShared]);

  const handleCreateRoom = async () => {
    // Safely get token on client side
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
        // Safely access localStorage on client side
        if (typeof window !== "undefined") {
          localStorage.removeItem("roomId");
          const roomId = response.data.id;
          localStorage.setItem("roomId", roomId);
          setNewRoomId(roomId);
        }
        toast({
          description: "Workroom created successfully!",
        });

        router.push(`/workroom/create/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating workroom:", error);
      toast({
        description: "Failed to create workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkroom = async (workroomId: string) => {
    // Safely get token on client side
    const token = typeof window !== "undefined" ? getToken() : null;
    setDeleting(true);
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      setDeleting(false); // Ensure loading state is reset
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

      // Refresh the workrooms data after deletion
      await fetch(`${backendUri}/api/v1/workrooms/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const workrooms = (data.workrooms || []).map((room: any) => ({
            id: room.id,
            name: room.title || "Untitled Room",
            createdBy: room.created_by || "Unknown",
            users: room.members || [],
            isActive: false,
          }));
          setRoomsData(workrooms);
        })
        .catch((err) => console.error("Error re-fetching workrooms:", err));

      router.refresh(); // Triggers a re-render of the current route
      setDeleting(false);
    } catch (error) {
      console.error("Error deleting workroom:", error);
      toast({
        description: "Failed to delete workroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleEditWorkroom = (workroomId: string) => {
    router.push(`/workroom/create/${workroomId}`); // Use /workroom/create/[roomId] for editing, as per your structure
  };

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return roomsData;
    return roomsData.filter((room) =>
      room.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, roomsData]);

  // Filter created workrooms
  const filteredCreatedWorkrooms = useMemo(() => {
    if (!searchQuery) return createdWorkrooms;
    return createdWorkrooms.filter((room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, createdWorkrooms]);

  // Filter shared workrooms
  const filteredSharedWorkrooms = useMemo(() => {
    if (!searchQuery) return sharedWorkrooms;
    return sharedWorkrooms.filter((room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sharedWorkrooms]);

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

        {loading ? (
          <RecentWorkroomsLoader />
        ) : roomsData[0] ? (
          <div className="w-full h-[clamp(6.25rem,_3.6752vh,_8.9375rem)] rounded-[16px] card-morph border border-[#956FD6] py-1 px-4 flex flex-col justify-between">
            <section className="flex justify-between">
              <div className="flex items-start flex-col gap-1">
                <MainHeading variant="bigCardTitle">
                  {roomsData[0].name}
                </MainHeading>
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
                        className="w-6 h-6 bg-black rounded-full relative" // Added relative for fill prop
                      >
                        <Image
                          src={user.avatar_url || DefaultAvatarPlaceholder}
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
        <Tabs
          defaultValue="workroom"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
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
                      <div className="flex items-center">
                        {/* Clustered avatars */}
                        {room.users && room.users.length > 0 && (
                          <div className="flex items-center -space-x-2 mr-2">
                            {room.users
                              .slice(0, 4)
                              .map((user: any, userIdx: number) => (
                                <div
                                  key={userIdx}
                                  className="w-7 h-7 bg-black rounded-full relative border-2 border-white" // Added relative for fill prop and border for visibility
                                  style={{ zIndex: 4 - userIdx }} // Ensures correct overlap order
                                >
                                  <Image
                                    src={
                                      user.avatar_url ||
                                      DefaultAvatarPlaceholder
                                    }
                                    className="rounded-full object-cover"
                                    alt={`${user.fullname || "User"}'s avatar`}
                                    fill
                                  />
                                </div>
                              ))}
                          </div>
                        )}
                        <p className="text-sm text-[#999999]">
                          {room.users?.length > 0
                            ? `${room.users.length} people in this workroom`
                            : "No one is in this workroom"}
                        </p>
                        <NavigationLink
                          href={`/workroom/room/${room.id}`}
                          variant={"outline"}
                          className="h-7 text-sm rounded-[6px] ring-[#211451] shadow-none ml-2"
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

          {/* New TabsContent for "Created by You" */}
          <TabsContent value="created" className="w-full flex flex-col gap-4">
            {loadingCreated ? (
              <p>Loading your created workrooms...</p>
            ) : filteredCreatedWorkrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreatedWorkrooms.map((workroom) => (
                  <div
                    key={workroom.id}
                    className="rounded-[16px] shadow-lg py-1 px-4 h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] flex flex-col justify-between hover:border hover:border-[#956FD6] cursor-pointer"
                    onClick={() => router.push(`/workroom/room/${workroom.id}`)}
                  >
                    <header className="flex justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <MainHeading variant="smallCardTitle">
                          {workroom.title}
                        </MainHeading>
                        <span className="text-sm text-muted-foreground">
                          Created by: {workroom.created_by}
                        </span>
                      </div>
                    </header>
                    <footer className="w-full flex items-center justify-between">
                      <div className="flex items-center">
                        {workroom.members && workroom.members.length > 0 && (
                          <div className="flex items-center -space-x-2 mr-2">
                            {workroom.members.slice(0, 4).map((member, idx) => (
                              <div
                                key={idx}
                                className="w-7 h-7 bg-black rounded-full relative border-2 border-white"
                                style={{ zIndex: 4 - idx }}
                              >
                                <Image
                                  src={
                                    member.avatar_url ||
                                    DefaultAvatarPlaceholder
                                  }
                                  className="rounded-full object-cover"
                                  alt={`${member.name}'s avatar`}
                                  fill
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-[#999999]">
                          {workroom.members.length > 0
                            ? `${workroom.members.length} people in this workroom`
                            : "No one is in this workroom"}
                        </p>
                        <NavigationLink
                          href={`/workroom/room/${workroom.id}`}
                          variant={"outline"}
                          className="h-7 text-sm rounded-[6px] ring-[#211451] shadow-none ml-2"
                        >
                          Open Workroom
                        </NavigationLink>
                      </div>
                    </footer>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No workrooms created by you found.
              </p>
            )}
          </TabsContent>

          {/* New TabsContent for "Shared Workrooms" */}
          <TabsContent value="shared" className="w-full flex flex-col gap-4">
            {loadingShared ? (
              <p>Loading shared workrooms...</p>
            ) : filteredSharedWorkrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSharedWorkrooms.map((workroom) => (
                  <div
                    key={workroom.id}
                    className="rounded-[16px] shadow-lg py-1 px-4 h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] flex flex-col justify-between hover:border hover:border-[#956FD6] cursor-pointer"
                    onClick={() => router.push(`/workroom/room/${workroom.id}`)}
                  >
                    <header className="flex justify-between">
                      <div className="flex flex-col items-start gap-2">
                        <MainHeading variant="smallCardTitle">
                          {workroom.title}
                        </MainHeading>
                        <span className="text-sm text-muted-foreground">
                          Created by: {workroom.created_by}
                        </span>
                      </div>
                    </header>
                    <footer className="w-full flex items-center justify-between">
                      <div className="flex items-center">
                        {workroom.members && workroom.members.length > 0 && (
                          <div className="flex items-center -space-x-2 mr-2">
                            {workroom.members.slice(0, 4).map((member, idx) => (
                              <div
                                key={idx}
                                className="w-7 h-7 bg-black rounded-full relative border-2 border-white"
                                style={{ zIndex: 4 - idx }}
                              >
                                <Image
                                  src={
                                    member.avatar_url ||
                                    DefaultAvatarPlaceholder
                                  }
                                  className="rounded-full object-cover"
                                  alt={`${member.name}'s avatar`}
                                  fill
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-[#999999]">
                          {workroom.members.length > 0
                            ? `${workroom.members.length} people in this workroom`
                            : "No one is in this workroom"}
                        </p>
                        <NavigationLink
                          href={`/workroom/room/${workroom.id}`}
                          variant={"outline"}
                          className="h-7 text-sm rounded-[6px] ring-[#211451] shadow-none ml-2"
                        >
                          Open Workroom
                        </NavigationLink>
                      </div>
                    </footer>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No shared workrooms found.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default WorkroomPage;
