"use client";
// className="bg-transparent shadow-none ring-0 border-0"
//    className="aspect-auto h-[160px] w-[600px]"
//  fill="#956fd670"
import React, { useState, useMemo, useEffect } from "react";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import { Button } from "@/components/ui/button";
import { Building, Loader2, Pen, Plus } from "lucide-react";
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

type WorkroomTask = {
  title?: string;
  name?: string;
  status?: string;
};

type WorkroomListItem = {
  id: string;
  name: string;
  createdBy: any;
  users: any[];
  isActive?: boolean;
  tasks?: WorkroomTask[];
  current_task?: { title?: string; name?: string } | string | null;
  currentTask?: { title?: string; name?: string } | string | null;
};

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

  const [roomsData, setRoomsData] = useState<WorkroomListItem[]>([]); // will use API schema
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

        const asBoolean = (value: unknown) => {
          if (typeof value === "boolean") return value;
          if (typeof value === "number") return value === 1;
          if (typeof value === "string") {
            const normalized = value.trim().toLowerCase();
            return normalized === "true" || normalized === "1";
          }
          return false;
        };

        // Adjusting to use the expected API response structure (while preserving extra fields if provided)
        const workrooms: WorkroomListItem[] = (data.workrooms || []).map(
          (room: any) => ({
            id: room.id,
            name: room.title || "Untitled Room", // Default to "Untitled Room" if title is missing
            createdBy: room.created_by || "Unknown", // Default to "Unknown" if created_by is missing
            users: room.members || [], // Default to an empty array if members are missing
            isActive: asBoolean(room.isActive ?? room.is_active ?? false),
            tasks: Array.isArray(room.tasks) ? room.tasks : [],
            current_task: room.current_task ?? null,
            currentTask: room.currentTask ?? null,
          })
        );

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
    router.push(`/workroom/edit/${workroomId}`); // Use /workroom/create/[roomId] for editing, as per your structure
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

  const activeRooms = useMemo(
    () => roomsData.filter((room) => Boolean(room.isActive)),
    [roomsData]
  );

  const getOnlineTaskTitle = (room: WorkroomListItem | undefined) => {
    if (!room) return null;

    const pickTitle = (taskLike: any) => {
      if (!taskLike) return null;
      if (typeof taskLike === "string") return taskLike;
      if (typeof taskLike?.title === "string" && taskLike.title.trim())
        return taskLike.title;
      if (typeof taskLike?.name === "string" && taskLike.name.trim())
        return taskLike.name;
      return null;
    };

    const direct = pickTitle(room.current_task) ?? pickTitle(room.currentTask);
    if (direct) return direct;

    const tasks = Array.isArray(room.tasks) ? room.tasks : [];
    const inProgress = tasks.find((t) =>
      String(t?.status || "")
        .toLowerCase()
        .replace(/_/g, " ")
        .includes("progress")
    );
    return pickTitle(inProgress) ?? pickTitle(tasks[0]) ?? null;
  };

  const activeRoomToShow = useMemo(() => activeRooms[0] ?? null, [activeRooms]);

  const activeRoomTaskTitle = useMemo(
    () => getOnlineTaskTitle(activeRoomToShow || undefined),
    [activeRoomToShow]
  );

  const handleBrowseWorkrooms = () => {
    const el = document.getElementById("workroom-list");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="py-12 px-10 flex flex-col  bg-[#FDFCFC]">
      <header className="flex w-full justify-between items-center">
        <MainHeading variant="secondary">Workrooms</MainHeading>
        <div className="flex items-center justify-around  w-3/5 gap-[clamp(0.625rem,_0.8547vw,_1.25rem)]">
          <div className="w-1/3 shadow-md rounded-2xl text-base font-medium text-gray-900 bg-white justify-center py-3.5 flex items-center gap-7">
            <div className="text-primary-hudddleLight">
              <Building />
            </div>
            <span>{roomsData.length} Workroom</span>
          </div>
          <div className="w-1/3 shadow-md rounded-2xl text-base font-medium text-gray-900 bg-white justify-center py-3.5 flex items-center gap-7">
            <div className="flex flex-col items-center leading-tight">
              <span>{activeRooms.length} Active</span>
              {activeRoomTaskTitle ? (
                <span className="text-xs text-muted-foreground">
                  {activeRoomTaskTitle}
                </span>
              ) : null}
            </div>
          </div>
          <NavigationLink
            className="w-1/3 h-auto py-3.5 rounded-2xl text-base font-medium text-white justify-center flex items-center gap-7 shadow-md"
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

      <section id="active-workroom" className="w-full flex flex-col mt-8">
        <header className="w-full flex items-center justify-between">
          <SubHeading className="text-base text-primary-hudddle font-medium">
            You&apos;re presently working on
          </SubHeading>
          <Button variant="ghost" size="icon">
            <Image src={BulletedList} alt="list" width={16} height={16} />
          </Button>
        </header>

        {loading ? (
          <RecentWorkroomsLoader />
        ) : activeRoomToShow ? (
          <div className="w-full  shadow-md rounded-[16px] card-morph  p-7 min-h-48 flex flex-col justify-between">
            <section className="flex justify-between ">
              <div className="flex items-start flex-col gap-3">
                <MainHeading variant="bigCardTitle">
                  {activeRoomToShow?.name}
                </MainHeading>
                {activeRoomTaskTitle ? (
                  <p className="text-sm text-muted-foreground">
                    Task: {activeRoomTaskTitle}
                  </p>
                ) : null}
                <Button
                  variant="ghost"
                  className="text-primary-hudddleLight space-x-1 text-xs p-0 h-0"
                  onClick={() => handleEditWorkroom(activeRoomToShow?.id)}
                >
                  <Pen size={10} />
                  <span>Edit workroom</span>
                </Button>
              </div>
              {activeRoomToShow?.isActive ? (
                <div className="w-4 h-4 bg-[#ADD359] animate-pulse rounded-full" />
              ) : null}
            </section>
            <section className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="flex gap-1">
                  {activeRoomToShow?.users
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
                  {activeRoomToShow?.users
                    ?.map((u: any) => u.fullname)
                    .join(", ")}{" "}
                  are in this workroom
                </p>
              </div>
              <div className="flex items-center gap-2">
                <NavigationLink
                  href={`/workroom/room/${activeRoomToShow?.id}`}
                  // href={`/workroom/room/${roomsData`}
                  variant={"outline"}
                  className="h-7 text-sm rounded-[6px] bg-primary-hudddle text-white capitalize shadow-none"
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
          <div className="w-full rounded-[16px] card-morph p-6 md:p-7 min-h-48 flex items-center">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-11 w-11 rounded-full bg-[#956FD6]/10 text-primary-hudddle flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-primary-hudddle">
                    No active workroom
                  </p>
                  <p className="text-sm text-muted-foreground max-w-[55ch]">
                    Create a workroom or join an existing one to start
                    collaborating and tracking tasks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-primary-hudddle/20 text-primary-hudddle hover:bg-primary-hudddle/5"
                  onClick={handleBrowseWorkrooms}
                >
                  <span>Browse workrooms</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="workroom-list" className="w-full pt-10">
        <Tabs
          defaultValue="workroom"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-5"
        >
          <div className="flex justify-between items-center ">
            <TabsList>
              {[
                { label: "workroom", value: "workroom" },
                { label: "Created by You", value: "created" },
                { label: "Shared Workrooms", value: "shared" },
              ].map((item) => (
                <TabsTrigger
                  className="text-primary-hudddle capitalize"
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Input
              type="search"
              placeholder="search"
              className="h-9 w-1/3 placeholder:capitalize p-4"
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
                    className="bg-white rounded-[16px] shadow-lg  h-48 px-10 py-5 flex flex-col justify-between hover:border hover:border-[#956FD6] "
                  >
                    <header className="flex justify-between">
                      <div className="flex flex-col items-start gap-3">
                        <MainHeading variant="smallCardTitle">
                          {room.name}
                        </MainHeading>
                        {isCreatedByYou ? (
                          <Button
                            variant="ghost"
                            className="text-[#956FD6] space-x-1 text-xs p-0 h-0"
                            onClick={() => handleEditWorkroom(room.id)}
                          >
                            <Pen size={12} />
                            <p>Edit workroom</p>
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
                            ? `${room.users.length} people are in this workroom`
                            : "No one is in this workroom"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <NavigationLink
                          href={`/workroom/room/${room.id}`}
                          variant={"outline"}
                          className="h-7 font-semibold text-sm text-primary-hudddle border border-primary-hudddle rounded-[6px]  shadow-none ml-2"
                        >
                          <Building size={18} />
                          Join Workroom...
                        </NavigationLink>
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
                      </div>
                    </footer>
                  </div>
                );
              })}
            </TabsContent>
          )}

          {/* New TabsContent for "Created by You" */}
          <TabsContent value="created" className="w-full flex flex-col gap-4">
            {loadingCreated ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary-hudddle" />
                <p className="text-gray-500">
                  Loading your created workrooms...
                </p>
              </div>
            ) : filteredCreatedWorkrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreatedWorkrooms.map((workroom) => (
                  <div
                    key={workroom.id}
                    className="rounded-[16px] shadow-lg py-5 px-6 h-48 flex flex-col justify-between hover:border hover:border-[#956FD6] cursor-pointer"
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
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary-hudddle" />
                <p className="text-gray-500">Loading shared workrooms...</p>
              </div>
            ) : filteredSharedWorkrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSharedWorkrooms.map((workroom) => (
                  <div
                    key={workroom.id}
                    className="rounded-[16px] shadow-lg py-5 px-6 h-48 flex flex-col justify-between hover:border hover:border-[#956FD6] cursor-pointer"
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
