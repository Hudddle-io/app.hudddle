"use client";

// Add this global declaration to fix the TypeScript error for 'window.chrome'
declare global {
  interface Window {
    chrome?: any;
  }
}

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyChart from "@/components/shared/demo-chart";
import KpiChart from "@/components/shared/kpi-chart";
import { Input } from "@/components/ui/input"; // Corrected import for Input
import { Plus } from "lucide-react";
import MyTask from "@/app/(tasks)/your-tasks/my-task"; // Assuming MyTask is a display component
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import { useRouter } from "next/navigation";
import NavigationLink from "@/components/basics/Navigation-link";
import { MoveLeft } from "lucide-react";
import { MetricChart } from "@/components/shared/mertic-chart"; // Corrected import statement
import RoomLoader from "@/components/loaders/room";
import { backendUri } from "@/lib/config";

// Import CreateWorkroomTaskSheet and fetchWorkroomDetails
import CreateWorkroomTaskSheet from "@/components/shared/create-workroom-task";
import fetchWorkroomDetails from "@/lib/fetch-workroom"; // Assuming this path is correct for WorkroomDetails interface

const Trash = "/assets/trash.svg";
const building = "/assets/building.png";
const chess = "/assets/chess.svg";
const strike = "/assets/strike-full.svg";
const clock = "/assets/clock.svg";

// Reusing TaskTodayProps for task data consistency
import { TaskTodayProps } from "@/lib/@types";
import { toast } from "@/components/ui/use-toast";
// Import DailyTimeLog and UserData. Assuming UserData is from dashboard/index.ts
import { DailyTimeLog } from "@/components/pages/dashboard/productivity-section";

// Import ProgressBar and Tooltip components
import ProgressBar from "@/components/shared/progress-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define a comprehensive interface for members within a room, compatible with UserData
interface RoomMemberData {
  id?: number | string; // Assuming members might have an ID similar to UserData
  name: string;
  xp: number; // Experience points, used for level calculation
  productivity: number; // Number of tasks completed
  avatar_url: string;
  teamwork_collaborations: number;
  level?: number; // General level or overall tier
  kpiAlignment?: string;
  kpi?: { kpiName: string; kpiMetric: string }; // Existing single KPI object
  roomKpis?: string[];
  aiSummary?: string;
  keyInsights?: string[];
  Recommendations?: string[];
  daily_active_minutes?: number; // Added to match UserData and display requirement
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string;
  average_task_time_hours?: number;
  // Added metrics array based on user's provided example
  metrics?: Array<{
    kpi_name: string;
    metric_value: number;
    weight: number;
  }>;
}

// Define WorkroomDetails interface if not already in fetch-workroom or @types
interface WorkroomDetails {
  name?: string;
  performance_metrics?: Array<{
    kpi_name: string;
    weight: number;
  }>;
  members?: RoomMemberData[]; // Use the new RoomMemberData interface
  completed_task_count?: number;
  pending_task_count?: number;
  tasks?: TaskTodayProps[];
}

interface RoomData {
  name?: string;
  performance_metrics?: Array<{
    kpi_name: string;
    weight: number;
  }>;
  members?: RoomMemberData[];
  completed_task_count?: number;
  pending_task_count?: number;
  tasks?: TaskTodayProps[];
}

interface AiSummary {
  description: string;
  keyInsights: string[];
  Recommendations: string[];
}

// Define UserLevelCategory and the calculation function
type UserLevelCategory = "Leader" | "Workaholic" | "Team Player" | "Slacker";

const calculateProgressPercentage = (
  points: number,
  category: UserLevelCategory
): number => {
  const thresholds = {
    Leader: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
    Workaholic: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
    "Team Player": {
      Beginner: 0,
      Intermediate: 50,
      Advanced: 150,
      Expert: 300,
    },
    Slacker: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
  };

  const currentCategoryThresholds = thresholds[category];
  if (!currentCategoryThresholds) return 0;

  let lowerBound = 0;
  let upperBound = Infinity;

  if (points < currentCategoryThresholds.Intermediate) {
    upperBound = currentCategoryThresholds.Intermediate;
  } else if (points < currentCategoryThresholds.Advanced) {
    lowerBound = currentCategoryThresholds.Intermediate;
    upperBound = currentCategoryThresholds.Advanced;
  } else if (points < currentCategoryThresholds.Expert) {
    lowerBound = currentCategoryThresholds.Advanced;
    upperBound = currentCategoryThresholds.Expert;
  } else {
    return 100; // Beyond expert level
  }

  // Ensure points are within bounds for calculation
  const clampedPoints = Math.max(lowerBound, Math.min(upperBound, points));

  const progress =
    ((clampedPoints - lowerBound) / (upperBound - lowerBound)) * 100;
  return Math.max(0, Math.min(100, progress));
};

const levelDescriptions: Record<UserLevelCategory, string> = {
  Leader:
    "Create more tasks and delegate effectively to boost your leadership score.",
  Workaholic:
    "Complete tasks on time and consistently to increase your workaholic level.",
  "Team Player":
    "Collaborate on tasks and accept invites to enhance your team player status.",
  Slacker:
    "Improve your task completion rate and stay active daily to avoid being a slacker.",
};

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [activeTab, setActiveTab] = useState("team-pulse");
  const [selectedMember, setSelectedMember] = useState<RoomMemberData | null>(
    null
  );
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(2); // Changed to 2 tasks per page

  const [allRoomTasks, setAllRoomTasks] = useState<TaskTodayProps[]>([]);
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "COMPLETED"
  >("ALL"); // New state for task filtering

  const [extensionStatus, setExtensionStatus] = useState({
    isInstalled: false,
    isPinned: false,
    isLoading: true,
  });

  const EXTENSION_ID = "bfmaemghdgdgllmphhdeapoeceicnaji";

  const refreshRoomData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${params.roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch room data during refresh");
      }

      const data: WorkroomDetails = await response.json();
      setRoomData(data);
      // Sort tasks by updated_at or created_at in descending order (most recent first)
      const sortedTasks = (data.tasks || []).sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA; // Descending order
      });
      setAllRoomTasks(sortedTasks);
      setSearchTerm("");
      setCurrentPage(1);
      setFilterStatus("ALL"); // Reset filter when data refreshes
    } catch (error) {
      console.error("Error refreshing room data:", error);
      toast({
        description: "Failed to refresh tasks. Please try reloading the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    async function fetchInitialRoomData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await fetch(
          `${backendUri}/api/v1/workrooms/${params.roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }

        const data = await response.json();
        console.log("Fetched room data:", data);
        setRoomData(data);
        // Sort tasks by updated_at or created_at in descending order (most recent first)
        interface SortableTask {
          updated_at?: string;
          created_at: string;
        }
        const sortedTasks = (data.tasks || []).sort(
          (a: SortableTask, b: SortableTask) => {
            const dateA: number = new Date(
              a.updated_at || a.created_at
            ).getTime();
            const dateB: number = new Date(
              b.updated_at || b.created_at
            ).getTime();
            return dateB - dateA; // Descending order
          }
        );
        setAllRoomTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setRoomData(null);
        setAllRoomTasks([]);
      }
    }

    async function checkExtensionStatus() {
      if (
        typeof window !== "undefined" &&
        window.chrome &&
        window.chrome.runtime
      ) {
        try {
          const response = await new Promise<{
            isInstalled: boolean;
            isPinned: boolean;
          } | null>((resolve) => {
            window.chrome.runtime.sendMessage(
              EXTENSION_ID,
              { type: "CHECK_EXTENSION_STATUS" },
              (
                res: { isInstalled: boolean; isPinned: boolean } | undefined
              ) => {
                if (window.chrome.runtime.lastError) {
                  console.warn(
                    "Extension not installed or cannot be reached:",
                    window.chrome.runtime.lastError.message
                  );
                  resolve(null);
                } else {
                  resolve(res ?? null);
                }
              }
            );
          });

          if (response) {
            setExtensionStatus({
              isInstalled: response.isInstalled,
              isPinned: response.isPinned,
              isLoading: false,
            });
          } else {
            setExtensionStatus({
              isInstalled: false,
              isPinned: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error communicating with extension:", error);
          setExtensionStatus({
            isInstalled: false,
            isPinned: false,
            isLoading: false,
          });
        }
      } else {
        setExtensionStatus({
          isInstalled: false,
          isPinned: false,
          isLoading: false,
        });
      }
    }

    fetchInitialRoomData();
    checkExtensionStatus();
  }, [params.roomId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]); // Reset page when search or filter changes

  // Filter tasks based on searchTerm and filterStatus
  const filteredAndSortedTasks = useMemo(() => {
    let tempTasks = [...allRoomTasks]; // Start with the sorted full list

    // Apply search term filter
    if (searchTerm) {
      tempTasks = tempTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter (case-insensitive)
    if (filterStatus === "PENDING") {
      tempTasks = tempTasks.filter(
        (task) => task.status?.toLowerCase() === "pending"
      );
    } else if (filterStatus === "COMPLETED") {
      tempTasks = tempTasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      );
    }

    return tempTasks;
  }, [allRoomTasks, searchTerm, filterStatus]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(
    indexOfFirstTask,
    indexOfLastTask
  );
  const totalPages = Math.ceil(filteredAndSortedTasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const safeRoomDataMembers = roomData?.members || [];
  const safeAiSummary = aiSummary || {
    description: "",
    keyInsights: [],
    Recommendations: [],
  };

  const handleMemberClick = (member: RoomMemberData) => {
    setSelectedMember(member);
    setActiveTab("participants");
  };

  const handleBack = () => {
    setSelectedMember(null);
  };

  // Toggle Pending Tasks Filter
  const togglePendingTasks = () => {
    setFilterStatus((prevStatus) =>
      prevStatus === "PENDING" ? "ALL" : "PENDING"
    );
  };

  // Toggle Completed Tasks Filter
  const toggleCompletedTasks = () => {
    setFilterStatus((prevStatus) =>
      prevStatus === "COMPLETED" ? "ALL" : "COMPLETED"
    );
  };

  const handleUseInRoomClick = () => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.chrome?.runtime?.sendMessage(EXTENSION_ID, { action: "useRoom" });
      console.log(`sent action to : ${EXTENSION_ID}`);
    } else {
      toast({
        description:
          "Please use Chrome browser with the 'Huddle In Room' extension installed and pinned.",
        variant: "destructive",
      });
    }
  };

  if (!roomData || extensionStatus.isLoading) {
    return <RoomLoader />;
  }

  const isUseInRoomButtonDisabled =
    !extensionStatus.isInstalled || !extensionStatus.isPinned;

  // Define the level categories for iteration
  const levelCategories: UserLevelCategory[] = [
    "Leader",
    "Workaholic",
    "Team Player",
    "Slacker",
  ];

  return (
    <main className="w-full flex flex-col gap-4 px-12 py-8">
      {/* CSS for custom scrollbar - Removed as per request, but keeping the style tag if needed for other global styles */}
      <style jsx>{`
        /* Custom scrollbar styles are now potentially redundant for tasks tab but kept for general app use */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px; /* width of the entire scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; /* color of the tracking area */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #888; /* color of the scroll thumb */
          border-radius: 10px; /* roundness of the scroll thumb */
          border: 3px solid #f1f1f1; /* creates padding around scroll thumb */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #555; /* color of the scroll thumb on hover */
        }
      `}</style>
      {/* header */}
      <header className="w-full h-[clamp(2.375rem,_2.2382rem+0.6838vh,_2.875rem)] flex justify-between items-center mb-[clamp(2.625rem,_2.4882rem+0.6838vw,_3.125rem)]">
        <div className="flex items-center gap-2">
          <NavigationLink
            icon={{
              icon_component: (
                <MoveLeft className="stroke-[1px] text-[#4D4D4D]" />
              ),
              icon_position: "left",
            }}
            variant={"ghost"}
           onClick={()=>{window.history.back()}}
            className="text-[9px]"
          >
            back
          </NavigationLink>
          <div id="room-name" className="flex flex-col h-full justify-between">
            <h1 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#211451] font-bold font-inria">
              {roomData.name || ""}
            </h1>
            <Button
              variant="ghost"
              className="text-[#956FD6] w-fit p-0 h-0 text-[clamp(0.625rem,_0.5128vw,_1rem)]"
            >
              Edit workroom
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {roomData.members &&
              roomData.members
                .slice(0, 3)
                .map((member, index) => (
                  <div
                    key={index}
                    className={`w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] rounded-full bg-cover bg-center`}
                    style={{ backgroundImage: `url(${member.avatar_url})` }}
                  ></div>
                ))}
          </span>
          <p className="text-[clamp(0.625rem,_0.1709vw,_0.75rem)] text-[#999999]">
            {roomData.members && roomData.members.length > 0
              ? `${roomData.members[0]?.name || "Member"} ${
                  roomData.members.length > 1 && roomData.members.length <= 3
                    ? `, ${roomData.members[1]?.name || "Member"}`
                    : roomData.members.length > 3
                    ? `and ${roomData.members.length - 1} others`
                    : ""
                } are in this workroom`
              : "No members in this workroom"}
          </p>
        </div>

        <div className="flex items-center gap-1 relative">
          <Button
            id="use-room"
            variant="outline"
            className={`h-full rounded-[6px] ring-[#211451] text-[#211451] ${
              isUseInRoomButtonDisabled
                ? "opacity-50 cursor-not-allowed bg-gray-200"
                : "bg-transparent"
            } text-[clamp(0.625rem,_0.1709vw,_0.75rem)]`}
            onClick={handleUseInRoomClick}
            disabled={isUseInRoomButtonDisabled}
          >
            Use inRoom
          </Button>
          {isUseInRoomButtonDisabled && (
            <div
              className={
                "absolute p-2 bottom-0 translate-y-[65px] -translate-x-[10px] left-0 bg-black text-white w-[120px] rounded-md break-words h-fit text-[9px] capitalize font-semi-bold font-inria"
              }
            >
              Please install our Inroom extension to use this feature
            </div>
          )}
          <Button variant="ghost" size="icon" className="w-fit p-0 h-0">
            <Image src={Trash} alt="list" width={13} height={15} />
          </Button>
        </div>
      </header>
      {/* main */}
      <section>
        <Tabs
          defaultValue="team-pulse"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="w-full flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="team-pulse">Team Pulse</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="team-pulse"
            className="w-full h-full flex gap-2 items-start "
          >
            {/* leader boards */}
            <header className="px-3 card-morph rounded-[16px] w-[clamp(16.875rem,_16.4306rem+2.2222vw,_18.5rem)] py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
              <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                Leaderboards
              </h3>

              <div className="flex flex-col gap-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                {/* users */}
                {safeRoomDataMembers
                  .sort((a, b) => b.xp - a.xp)
                  .slice(0, 4)
                  .map((m, i) => (
                    <div
                      key={i}
                      className="h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] bg-[#956fd634] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end cursor-pointer"
                      onClick={() => handleMemberClick(m)}
                    >
                      <section className="flex items-center h-full gap-1">
                        <div className="w-[clamp(1.5rem,_1.3974rem+0.5128vw,_1.875rem)] h-[clamp(1.5rem,_1.3974rem+0.5128vh,_1.875rem)]  rounded-full relative">
                          <Image
                            fill
                            className="rounded-full object-cover"
                            src={m.avatar_url}
                            alt={`${m.name}-image`}
                          />
                        </div>
                        <div className="h-full flex flex-col justify-between">
                          <h5 className="text-[clamp(0.525rem,_0.5566rem+0.3419vw,_0.775rem)] text-[#211451] font-bold font-inria">
                            {m.name}
                          </h5>
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1 text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                              <Image
                                src={"/assets/strike-full.svg"}
                                alt="strike"
                                width={9}
                                height={9}
                              />
                              {m.xp}
                            </span>
                            <span className="text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                              {m.productivity} tasks
                            </span>
                          </div>
                        </div>
                      </section>

                      <Button
                        variant="ghost"
                        className="p-0 h-0 text-[#5C5CE9] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]"
                      >
                        <Image
                          src={"/assets/ai.svg"}
                          alt="strike"
                          width={9}
                          height={9}
                        />
                        Ai Sumary
                      </Button>
                    </div>
                  ))}
              </div>
            </header>
            {/* metric overviews */}
            <div className="px-3 card-morph rounded-[16px] w-5/6 py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
              <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                Metric Overview
              </h3>
              <div className="w-full flex gap-4 h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] items-center mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                <KpiChart />
                <WeeklyChart />
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  KPI Pulse Monitor
                </h3>
                {/* Metric cards layout: 3 per row */}
                <section className="grid grid-cols-3 gap-4 w-full">
                  {(roomData?.performance_metrics ?? []).map((metric, i) => (
                    <div
                      key={i}
                      // Metric cards now use flex-basis to ensure 3 cards per row
                      className="h-[250px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670] flex flex-col justify-center items-center p-2"
                    >
                      <MetricChart
                        kpiName={metric.kpi_name}
                        weight={metric.weight}
                      />
                      <span className="text-center w-full">
                        {" "}
                        {metric.kpi_name}
                      </span>
                    </div>
                  ))}
                </section>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <Image src="/assets/ai.svg" alt="ai" width={24} height={24} />
                  Ai Summary
                </h3>

                <article className="flex flex-col gap-2">
                  <p className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                    {safeAiSummary.description}
                  </p>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                      Key Insights :
                    </h3>
                    <div className="flex flex-col gap-1">
                      {safeAiSummary.keyInsights.map((insight, i) => (
                        <p
                          key={i}
                          className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                        >
                          - {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                      Recommendations
                    </h3>
                    <div className="flex flex-col gap-1">
                      {safeAiSummary.Recommendations.map(
                        (recommendation, i) => (
                          <p
                            key={i}
                            className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                          >
                            {i + 1}. {recommendation}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="tasks"
            className="w-[90%] mx-auto flex flex-col gap-10" // Removed overflow-y-auto and custom-scrollbar
          >
            <header className="w-full flex items-center justify-between">
              {/* Search Input for Tasks */}
              <Input
                className="w-[clamp(18.75rem,_18.1346rem+3.0769vw,_21rem)] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                type="search"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex gap-4 items-center">
                <Button
                  variant="outline"
                  className={`flex space-x-2 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] ${
                    filterStatus === "COMPLETED"
                      ? "bg-[#211451] text-white hover:bg-[#211451]/90"
                      : ""
                  }`}
                  onClick={toggleCompletedTasks}
                >
                  <Image src={building} alt="" width={20} height={20} />
                  <h1>
                    <strong>
                      {roomData.completed_task_count || 0}/
                      {(roomData.completed_task_count || 0) +
                        (roomData.pending_task_count || 0)}{" "}
                      tasks
                    </strong>{" "}
                    completed
                  </h1>
                </Button>
                <Button
                  variant="outline"
                  className={`flex space-x-2 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] ${
                    filterStatus === "PENDING"
                      ? "bg-[#956FD6] text-white hover:bg-[#956FD6]/90"
                      : ""
                  }`}
                  onClick={togglePendingTasks}
                >
                  <h1 className="text-[#956FD6]">
                    {roomData.pending_task_count || 0} Pending tasks
                  </h1>
                </Button>
                {/* Replaced existing Create Task Button */}
                <Button
                  className="bg-[#211451] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                  onClick={() => setIsCreateTaskSheetOpen(true)} // Open the sheet
                >
                  <Plus size={24} color="white" />
                  <span>Create Task</span>
                </Button>
                {/* CreateWorkroomTaskSheet Component */}
                <CreateWorkroomTaskSheet
                  isOpen={isCreateTaskSheetOpen}
                  workroomId={params.roomId || undefined}
                  onClose={() => setIsCreateTaskSheetOpen(false)}
                  onTaskCreated={refreshRoomData} // Refresh tasks after creation
                />
              </div>
            </header>

            <section className="flex flex-col gap-2">
              {/* Display current tasks for the page */}
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <MyTask
                    key={task.id} // Assuming tasks have a unique 'id'
                    tasks={[task]} // MyTask likely expects an array, pass single task in an array
                    totalItems={1} // Adjust if MyTask needs actual total per item
                    setLoadingTasks={() => {}}
                    setErrorTasks={() => {}}
                    setTasks={() => {}}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No tasks found for the current search/filter.
                </p>
              )}
            </section>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <Button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          pageNumber === currentPage
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    )
                  )}
                  <Button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </TabsContent>
          <TabsContent
            value="participants"
            className="w-full h-full grid grid-rows-1 gap-2"
          >
            {selectedMember ? (
              <section className="w-full flex gap-6">
                <header className="w-[clamp(15rem,_14.265rem+3.6752vw,_17.6875rem)] h-fit rounded-[25px] bg-[#956fd610] px-[clamp(1.5625rem,_1.4428rem+0.5983vw,_2rem)] py-[clamp(1.25rem,_1.0962rem+0.7692vw,_1.8125rem)]">
                  <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2" size={16} /> Back to
                    Participants
                  </Button>
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="w-[clamp(11.125rem,_11.0395rem+0.4274vw,_11.4375rem)] h-[clamp(11.125rem,_11.0395rem+0.4274vh,_11.4375rem)] rounded-full bg-black relative">
                      <Image
                        className="rounded-full object-cover"
                        fill
                        src={selectedMember.avatar_url}
                        alt={selectedMember.name}
                      />
                    </div>
                    <h2 className="text-[clamp(1.5rem,_1.4145rem+0.4274vw,_1.8125rem)] text-[#211451] font-bold">
                      {selectedMember.name}
                    </h2>
                    <p className="text-[#956FD6] text-[clamp(0.8125rem,_0.727rem+0.4274vw,_1.125rem)]">
                      Level: {selectedMember.level}
                    </p>
                  </div>

                  {/* Level Leaderboards section */}
                  <div
                    className="w-full flex flex-col gap-2"
                    id="level-leaderboards"
                  >
                    {levelCategories.map((category) => {
                      // Use xp as points for progress calculation
                      const progressValue = calculateProgressPercentage(
                        selectedMember.xp,
                        category
                      );
                      // Determine progress bar color based on category
                      const progressColor =
                        category === "Leader"
                          ? "#F97316"
                          : category === "Workaholic"
                          ? "#84CC16"
                          : category === "Team Player"
                          ? "#2563EB"
                          : "#EC4899"; // Default for Slacker or other
                      return (
                        <div key={category} className="flex flex-col gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center gap-3 cursor-pointer">
                                  <Image
                                    src={chess} // Keep the existing chess image
                                    alt={category}
                                    height={23}
                                    width={12.09}
                                  />
                                  <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                                    {category}
                                  </h3>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{levelDescriptions[category]}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <ProgressBar
                                  className="w-full h-[clamp(0.8125rem,_00.7783rem+0.1709vh,_0.9375rem)] bg-[#D9D9D9] cursor-pointer"
                                  progressValue={progressValue} // Set the calculated progress
                                  progressColor={progressColor} // Pass the dynamic color
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{Math.round(progressValue)}%</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      );
                    })}
                  </div>
                </header>
                <div className="w-full flex flex-col gap-14">
                  {/* Pass selectedMember to DailyTimeLog for its daily_active_minutes */}
                  {selectedMember.daily_active_minutes !== undefined ? (
                    <DailyTimeLog
                      currentUser={selectedMember as any} // Cast to any to satisfy UserData if exact match isn't there
                      updateDailyActiveMinutes={() => {}} // No-op as RoomPage isn't updating it
                    />
                  ) : (
                    // Fallback if daily_active_minutes is not available
                    "N/A mins"
                  )}

                  <section className="w-full h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] flex items-center gap-4 mb-6">
                    <KpiChart />
                    <WeeklyChart />
                  </section>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                      KPI Pulse Monitor
                    </h3>
                    {/* Metric cards layout for selected member: 3 per row */}
                    <section className="grid grid-cols-3 gap-4 w-full">
                      {/* Check if selectedMember and its metrics array exist and have content */}
                      {selectedMember.metrics &&
                      selectedMember.metrics.length > 0 ? (
                        selectedMember.metrics.map((metric, i) => (
                          <div
                            key={i} // Use a unique key
                            className="h-[250px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670] flex flex-col justify-center items-center p-2"
                          >
                            <MetricChart
                              kpiName={metric.kpi_name}
                              weight={metric.weight}
                            />
                            <span className="text-center w-full text-sm mt-2">
                              {metric.kpi_name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                          No KPI metrics available for this member.
                        </div>
                      )}
                    </section>
                  </div>

                  <div className="flex flex-col gap-4 mt-12">
                    <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                      <Image
                        src="/assets/ai.svg"
                        alt="ai"
                        width={24}
                        height={24}
                      />
                      Ai Summary
                    </h3>

                    <article className="flex flex-col gap-2">
                      <p className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                        {selectedMember.aiSummary || safeAiSummary.description}
                      </p>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                          Key Insights :
                        </h3>
                        <div className="flex flex-col gap-1">
                          {(
                            selectedMember.keyInsights ||
                            safeAiSummary.keyInsights
                          ).map((insight: string, i: number) => (
                            <p
                              key={i}
                              className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                            >
                              - {insight}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                          Recommendations
                        </h3>
                        <div className="flex flex-col gap-1">
                          {(
                            selectedMember.Recommendations ||
                            safeAiSummary.Recommendations
                          ).map((recommendation: string, i: number) => (
                            <p
                              key={i}
                              className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                            >
                              {i + 1}. {recommendation}
                            </p>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                  <p>Points: {selectedMember.xp}</p>
                  <p>Tasks Done: {selectedMember.productivity}</p>
                  <p>KPI Alignment: {selectedMember.kpiAlignment}</p>
                  <div>
                    <h3 className="font-semibold mt-2">Room KPIs:</h3>
                    <ul>
                      {selectedMember.roomKpis &&
                        selectedMember.roomKpis.map(
                          (kpi: string, index: number) => (
                            <li key={index}>{kpi}</li>
                          )
                        )}
                    </ul>
                  </div>
                  {selectedMember.kpi && (
                    <div>
                      <h3 className="font-semibold mt-2">Member KPI:</h3>
                      <p>Name: {selectedMember.kpi.kpiName}</p>
                      <p>Metric: {selectedMember.kpi.kpiMetric}</p>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              safeRoomDataMembers.map((member, i) => (
                <div
                  key={i}
                  className="w-full border-b border-[#9999993d] h-[clamp(2.4375rem,_2.3349rem+0.5128vh,_2.8125rem)] flex items-center justify-between cursor-pointer"
                  onClick={() => handleMemberClick(member)}
                >
                  <section className="flex items-center gap-5">
                    <div className="w-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] h-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] relative">
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className=" rounded-full object-cover"
                      />
                    </div>
                    <span className="text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] text-[#262626] font-bold">
                      {member.name}
                    </span>
                  </section>

                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-transparent text-[clamp(0.5rem,_0.3974rem+0.5128vw,_0.875rem)]"
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
