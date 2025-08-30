"use client";

// Removed the global declaration for 'window.chrome' as it's no longer used for this specific button

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyChart from "@/components/shared/demo-chart";
import KpiChart from "@/components/shared/kpi-chart";
import { Input } from "@/components/ui/input"; // Corrected import for Input
import { Plus } from "lucide-react";
import MyTask from "@/app/(tasks)/your-tasks/my-task"; // Assuming MyTask is a display component
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react"; // Added useMemo and useRef
import { useRouter } from "next/navigation";
import NavigationLink from "@/components/basics/Navigation-link";
import { MoveLeft } from "lucide-react";
import { MetricChart } from "@/components/shared/mertic-chart"; // Corrected import statement
import RoomLoader from "@/components/loaders/room";
import { backendUri } from "@/lib/config";
// Import motion from framer-motion
import { motion } from "framer-motion";

// Import CreateWorkroomTaskSheet and fetchWorkroomDetails
import CreateWorkroomTaskSheet from "@/components/shared/create-workroom-task";

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
import Chat from "@/components/basics/chat";

const DefaultAvatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.50 3.22-6 3.22z'/%3E%3C/svg%3E";

interface KpiBreakdownEntry {
  kpi_name: string;
  percentage: number;
  weight: number | null;
  metric_value: number | null;
}

interface KpiSummary {
  overall_alignment_percentage: number;
  summary_text: string;
  kpi_breakdown: Record<string, number>;
}

interface KpiMetricHistoryEntry {
  kpi_name: string;
  date: string;
  alignment_percentage: number;
}

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  score: number;
  rank: number;
  kpi_score: number;
  task_score: number;
  teamwork_score: number;
  engagement_score: number;
}

export interface RoomMemberData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  productivity: number;
  average_task_time: number;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  kpi_summary?: {
    overall_alignment_percentage?: number;
    summary_text?: string;
    kpi_breakdown?: KpiBreakdownEntry[];
  };
  kpi_metric_history?: KpiMetricHistoryEntry[];
  leaderboard_entry?: LeaderboardEntry | null;
}

interface WorkroomDetails {
  id: string;
  name: string;
  members: RoomMemberData[];
  completed_task_count: number;
  pending_task_count: number;
  tasks: TaskTodayProps[];
  performance_metrics: Array<{
    kpi_name: string;
    weight: number;
  }>;
  workroom_kpi_summary: KpiSummary;
  workroom_kpi_metric_history: KpiMetricHistoryEntry[];
  leaderboard: LeaderboardEntry[];
}

interface RoomData extends WorkroomDetails {}

interface AiSummary {
  description: string;
  keyInsights: string[];
  Recommendations: string[];
}

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

type LeaderboardDisplayMember = RoomMemberData | LeaderboardEntry;

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
  const [tasksPerPage, setTasksPerPage] = useState(2);
  const [allRoomTasks, setAllRoomTasks] = useState<TaskTodayProps[]>([]);
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "COMPLETED"
  >("ALL");

  // Removed extensionStatus and EXTENSION_ID as they are no longer relevant for this button's functionality

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
      console.log("Refreshed room data:", data);
      setRoomData(data);

      const sortedTasks = (data.tasks || []).sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA;
      });
      setAllRoomTasks(sortedTasks);

      if (data.workroom_kpi_summary) {
        const summaryText = data.workroom_kpi_summary.summary_text;
        const keyInsightsMatch = summaryText.match(
          /Key Insights\s*:\s*([\s\S]*?)(?=Recommendations|$)/i
        );
        const recommendationsMatch = summaryText.match(
          /Recommendations\s*([\s\S]*)/i
        );

        const insights = keyInsightsMatch
          ? keyInsightsMatch[1]
              .split("-")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        const recommendations = recommendationsMatch
          ? recommendationsMatch[1]
              .split(/\d+\.\s*/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        setAiSummary({
          description: summaryText,
          keyInsights: insights,
          Recommendations: recommendations,
        });
      }

      setSearchTerm("");
      setCurrentPage(1);
      setFilterStatus("ALL");
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

        const data: WorkroomDetails = await response.json();
        console.log("Fetched room data:", data);
        setRoomData(data);

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
            return dateB - dateA;
          }
        );
        setAllRoomTasks(sortedTasks);

        if (data.workroom_kpi_summary) {
          const summaryText = data.workroom_kpi_summary.summary_text;
          const keyInsightsMatch = summaryText.match(
            /Key Insights\s*:\s*([\s\S]*?)(?=Recommendations|$)/i
          );
          const recommendationsMatch = summaryText.match(
            /Recommendations\s*([\s\S]*)/i
          );

          const insights = keyInsightsMatch
            ? keyInsightsMatch[1]
                .split("-")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];
          const recommendations = recommendationsMatch
            ? recommendationsMatch[1]
                .split(/\d+\.\s*/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

          setAiSummary({
            description: summaryText,
            keyInsights: insights,
            Recommendations: recommendations,
          });
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setRoomData(null);
        setAllRoomTasks([]);
      }
    }

    // Removed checkExtensionStatus as it's no longer used for this button's functionality
    // If you have other parts of your app relying on extension status, you might want to keep it.

    fetchInitialRoomData();
  }, [params.roomId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredAndSortedTasks = useMemo(() => {
    let tempTasks = [...allRoomTasks];

    if (searchTerm) {
      tempTasks = tempTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

  const togglePendingTasks = () => {
    setFilterStatus((prevStatus) =>
      prevStatus === "PENDING" ? "ALL" : "PENDING"
    );
  };

  const toggleCompletedTasks = () => {
    setFilterStatus((prevStatus) =>
      prevStatus === "COMPLETED" ? "ALL" : "COMPLETED"
    );
  };

  // --- UPDATED: handleUseInRoomClick to send only workroomId to desktop app ---
  const handleUseInRoomClick = async () => {
    const workroomId = params.roomId;

    try {
      // Method 1: Try HTTP server connection (desktop app listens on port 3001)
      const httpResponse = await fetch(
        `http://localhost:3001/connect-workroom?workroomId=${encodeURIComponent(
          workroomId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (httpResponse.ok) {
        const data = await httpResponse.json();
        toast({
          description: data.message || "Successfully connected to desktop app!",
          variant: "default",
        });
        console.log("Desktop app connection successful:", data);
        return; // Exit if HTTP method succeeds
      }
    } catch (httpError) {
      console.log("HTTP connection failed, trying protocol method:", httpError);
    }

    try {
      // Method 2: Try custom protocol (fallback method)
      const protocolUrl = `hudddle-desktop://connect-workroom?workroomId=${encodeURIComponent(
        workroomId
      )}`;

      // Create a temporary anchor element to trigger the protocol
      const anchor = document.createElement("a");
      anchor.href = protocolUrl;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      toast({
        description:
          "Opening desktop app... If the app doesn't open, please start it manually.",
        variant: "default",
      });

      console.log("Protocol method triggered:", protocolUrl);

      // Give the desktop app time to start, then try HTTP connection again
      setTimeout(async () => {
        try {
          const retryResponse = await fetch(
            `http://localhost:3001/connect-workroom?workroomId=${encodeURIComponent(
              workroomId
            )}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            toast({
              description:
                retryData.message || "Desktop app connected successfully!",
              variant: "default",
            });
            console.log("Retry connection successful:", retryData);
          } else {
            console.log(
              "Retry connection failed, but protocol may have worked"
            );
          }
        } catch (retryError) {
          console.log("Retry connection failed:", retryError);
          // Don't show error toast here as the protocol method might have worked
        }
      }, 3000); // Wait 3 seconds for desktop app to start
    } catch (protocolError) {
      console.error("Protocol method failed:", protocolError);
      toast({
        description:
          "Could not connect to desktop app. Please ensure Hudddle Desktop is installed and try again.",
        variant: "destructive",
      });
    }
  };
  // --- END UPDATED ---

  if (!roomData) {
    // Simplified loading state as extensionStatus.isLoading is removed
    return <RoomLoader />;
  }

  // Removed isUseInRoomButtonDisabled as it's no longer tied to extension status
  // The button will now always attempt to send to the Electron app, and the fetch
  // error handling will indicate if the Electron app is not running.

  const levelCategories: UserLevelCategory[] = [
    "Leader",
    "Workaholic",
    "Team Player",
    "Slacker",
  ];

  return (
    <main className="w-full flex flex-col gap-4 px-12 py-8 relative">
      {/* CSS for custom scrollbar */}
      <style jsx>{`
        /* Custom scrollbar styles */
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
        /* No scrollbar for elements with .no-scrollbar */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
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
            onClick={() => {
              window.history.back();
            }}
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
              roomData.members.slice(0, 3).map((member, index) => (
                <div
                  key={member.id || index}
                  className={`w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] rounded-full bg-cover bg-center`}
                  style={{
                    backgroundImage: `url(${
                      member.avatar_url || DefaultAvatarPlaceholder
                    })`,
                  }}
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
          {/* Updated Button to call the new handleUseInRoomClick function */}
          <Button
            variant="outline"
            className={`h-full rounded-[6px] ring-[#211451] text-[#211451] text-[clamp(0.625rem,_0.1709vw,_0.75rem)]`}
            onClick={handleUseInRoomClick} // Changed to call the new handler
          >
            Use inRoom
          </Button>
          {/* Removed the disabled tooltip as it's no longer controlled by extension status */}
          <Button variant="ghost" size="icon" className="w-fit p-0 h-0">
            <Image src={Trash} alt="list" width={13} height={15} />
          </Button>
        </div>
      </header>
      {/* main */}
      <section className="flex-1">
        <Tabs
          defaultValue="team-pulse"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="w-full flex items-center justify-between ">
            <TabsList>
              <TabsTrigger
                value="team-pulse"
                onClick={() => setActiveTab("team-pulse")}
              >
                Team Pulse
              </TabsTrigger>
              <TabsTrigger value="tasks" onClick={() => setActiveTab("tasks")}>
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="participants"
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Team Pulse Tab Content */}
          {activeTab === "team-pulse" && (
            <TabsContent
              value="team-pulse"
              className="w-full flex-1 flex gap-2 items-start pt-4 min-h-[calc(100vh-150px)]"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sticky top-4 self-start flex-shrink-0"
                style={{ maxHeight: "calc(100vh - 120px)" }}
              >
                <header
                  id="leader-board"
                  className="px-3 card-morph rounded-[16px] w-[clamp(16.875rem,_16.4306rem+2.2222vw,_18.5rem)] py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] h-full overflow-y-auto custom-scrollbar"
                >
                  <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                    Leaderboards
                  </h3>
                  <div className="flex flex-col gap-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                    {(
                      roomData.leaderboard ||
                      safeRoomDataMembers.sort((a, b) => b.xp - a.xp)
                    )
                      .sort((a, b) => {
                        if (roomData.leaderboard) {
                          return (
                            (a as LeaderboardEntry).rank -
                            (b as LeaderboardEntry).rank
                          );
                        } else {
                          return 0;
                        }
                      })
                      .slice(0, 4)
                      .map((m: LeaderboardDisplayMember, i) => (
                        <div
                          key={
                            (m as RoomMemberData).id ||
                            (m as LeaderboardEntry).user_id ||
                            i
                          }
                          className="h-auto min-h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] hover:bg-[#956fd634] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end cursor-pointer"
                          onClick={() => {
                            const fullMemberData = safeRoomDataMembers.find(
                              (member) =>
                                member.id === (m as RoomMemberData).id ||
                                member.id === (m as LeaderboardEntry).user_id
                            );
                            if (fullMemberData) {
                              handleMemberClick(fullMemberData);
                            }
                          }}
                        >
                          <section className="flex items-center h-full gap-1">
                            <div className="w-[clamp(1.5rem,_1.3974rem+0.5128vw,_1.875rem)] h-[clamp(1.5rem,_1.3974rem+0.5128vh,_1.875rem)] rounded-full relative">
                              <Image
                                fill
                                className="rounded-full object-cover"
                                src={m.avatar_url || DefaultAvatarPlaceholder}
                                alt={`${
                                  (m as RoomMemberData).name ||
                                  (m as LeaderboardEntry).user_name
                                }-image`}
                              />
                            </div>
                            <div className="h-full flex flex-col justify-between">
                              <h5 className="text-[clamp(0.525rem,_0.5566rem+0.3419vw,_0.775rem)] text-[#211451] font-bold font-inria">
                                {(m as RoomMemberData).name ||
                                  (m as LeaderboardEntry).user_name}
                              </h5>
                              <div className="flex gap-4">
                                <span className="flex items-center gap-1 text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                                  <Image
                                    src={"/assets/strike-full.svg"}
                                    alt="strike"
                                    width={9}
                                    height={9}
                                  />
                                  {(m as RoomMemberData).xp ??
                                    (m as LeaderboardEntry).score}{" "}
                                </span>
                                <span className="text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                                  {(m as RoomMemberData).productivity ??
                                    (m as LeaderboardEntry).task_score}{" "}
                                  tasks
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
                              alt="ai"
                              width={9}
                              height={9}
                            />
                            Ai Summary
                          </Button>
                        </div>
                      ))}
                  </div>
                </header>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 px-3 card-morph rounded-[16px] py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] overflow-y-auto custom-scrollbar h-full"
              >
                <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  Metric Overview
                </h3>
                <div className="w-full flex gap-4 h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] items-center mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <KpiChart
                    overallAlignmentPercentage={
                      roomData.workroom_kpi_summary
                        ?.overall_alignment_percentage || 0
                    }
                  />
                  <WeeklyChart
                    historyData={roomData.workroom_kpi_metric_history || []}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                    KPI Pulse Monitor
                  </h3>
                  <section className="grid grid-cols-3 gap-4 w-full">
                    {(
                      roomData.workroom_kpi_summary?.kpi_breakdown &&
                      Object.entries(
                        roomData.workroom_kpi_summary.kpi_breakdown
                      )
                    )?.map(([kpi_name, percentage], i) => (
                      <div
                        key={i}
                        className="h-[250px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670] flex flex-col justify-center items-center p-2"
                      >
                        <MetricChart
                          kpiName={kpi_name}
                          weight={percentage / 10 || 0}
                          percentage={percentage}
                        />
                        <span className="text-center w-full"> {kpi_name}</span>
                      </div>
                    ))}
                  </section>
                </div>
                <div className="flex flex-col gap-4 mt-12">
                  <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.556rem+0.3419vw,_0.875rem)]">
                    <Image
                      src="/assets/ai.svg"
                      alt="ai"
                      width={24}
                      height={24}
                    />
                    Ai Summary
                  </h3>

                  <article className="flex flex-col gap-2">
                    <p className="text-[clamp(0.625rem,_0.556rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                      {safeAiSummary.description}
                    </p>
                  </article>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Tasks Tab Content */}
          {activeTab === "tasks" && (
            <TabsContent
              value="tasks"
              className="w-[90%] mx-auto flex flex-col gap-10 overflow-y-auto custom-scrollbar flex-1 min-h-[calc(100vh-150px)]"
            >
              <header className="w-full flex items-center justify-between">
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
                  <Button
                    className="bg-[#211451] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                    onClick={() => setIsCreateTaskSheetOpen(true)}
                  >
                    <Plus size={24} color="white" />
                    <span>Create Task</span>
                  </Button>
                  <CreateWorkroomTaskSheet
                    isOpen={isCreateTaskSheetOpen}
                    workroomId={params.roomId || undefined}
                    onClose={() => setIsCreateTaskSheetOpen(false)}
                    onTaskCreated={refreshRoomData}
                  />
                </div>
              </header>

              <section className="flex flex-col gap-2">
                {currentTasks.length > 0 ? (
                  currentTasks.map((task) => (
                    <MyTask
                      key={task.id}
                      tasks={[task]}
                      totalItems={1}
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
          )}

          {/* Participants Tab Content */}
          {activeTab === "participants" && (
            <TabsContent
              value="participants"
              className="w-full flex-1 pt-4 relative flex overflow-y-auto custom-scrollbar"
              style={{ maxHeight: "calc(100vh - 120px)" }}
            >
              {selectedMember ? (
                <section className="w-full flex gap-6 h-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sticky top-0 self-start flex-shrink-0"
                    style={{
                      width: "clamp(15rem,_14.265rem+3.6752vw,_17.6875rem)",
                      maxHeight: "calc(100vh - 120px)",
                    }}
                  >
                    <header
                      id={"participants-details-header"}
                      className="w-full h-fit rounded-[25px] bg-[#956fd610] px-[clamp(1.5625rem,_1.4428rem+0.5983vw,_2rem)] py-[clamp(1.25rem,_1.0962rem+0.7692vw,_1.8125rem)] flex flex-col "
                    >
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-4"
                      >
                        <ArrowLeft className="mr-2" size={16} /> Back to
                        Participants
                      </Button>
                      <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="w-[clamp(11.125rem,_11.0395rem+0.4274vw,_11.4375rem)] h-[clamp(11.125rem,_11.0395rem+0.4274vh,_11.4375rem)] rounded-full bg-black relative">
                          <Image
                            className="rounded-full object-cover"
                            fill
                            src={
                              selectedMember.avatar_url ||
                              DefaultAvatarPlaceholder
                            }
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

                      <div
                        className="w-full flex flex-col gap-2"
                        id="level-leaderboards"
                      >
                        {levelCategories.map((category) => {
                          const progressValue = calculateProgressPercentage(
                            selectedMember.xp,
                            category
                          );
                          const progressColor =
                            category === "Leader"
                              ? "#F97316"
                              : category === "Workaholic"
                              ? "#84CC16"
                              : category === "Team Player"
                              ? "#2563EB"
                              : "#EC4899";
                          return (
                            <div key={category} className="flex flex-col gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center gap-3 cursor-pointer">
                                      <Image
                                        src={chess}
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
                                      progressValue={progressValue}
                                      progressColor={progressColor}
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
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full flex flex-col gap-14 flex-1 overflow-y-auto custom-scrollbar"
                    style={{
                      height: "100%",
                    }}
                  >
                    {selectedMember.daily_active_minutes !== undefined ? (
                      <DailyTimeLog
                        currentUser={selectedMember as RoomMemberData}
                        onUpdateUserData={async (
                          _data: Partial<RoomMemberData>
                        ) => {
                          return;
                        }}
                      />
                    ) : (
                      "N/A mins"
                    )}
                    <section className="w-full h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] flex items-center gap-4 mb-6">
                      <KpiChart
                        overallAlignmentPercentage={
                          selectedMember.kpi_summary
                            ?.overall_alignment_percentage || 0
                        }
                      />
                      <WeeklyChart
                        historyData={selectedMember.kpi_metric_history || []}
                      />
                    </section>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                        KPI Pulse Monitor
                      </h3>
                      <section className="grid grid-cols-3 gap-4 w-full">
                        {selectedMember.kpi_summary &&
                        selectedMember.kpi_summary.kpi_breakdown &&
                        selectedMember.kpi_summary.kpi_breakdown.length > 0 ? (
                          selectedMember.kpi_summary.kpi_breakdown.map(
                            (metric, i) => (
                              <div
                                key={i}
                                className="h-[250px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670] flex flex-col justify-center items-center p-2"
                              >
                                <MetricChart
                                  kpiName={metric.kpi_name}
                                  weight={metric.weight || 0}
                                  percentage={metric.percentage}
                                />
                                <span className="text-center w-full text-sm mt-2">
                                  {metric.kpi_name}
                                </span>
                              </div>
                            )
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            No KPI metrics available for this member.
                          </div>
                        )}
                      </section>
                    </div>
                    <div className="flex flex-col gap-4 mt-12">
                      <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.556rem+0.3419vw,_0.875rem)]">
                        <Image
                          src="/assets/ai.svg"
                          alt="ai"
                          width={24}
                          height={24}
                        />
                        Ai Summary
                      </h3>

                      <article className="flex flex-col gap-2">
                        <p className="text-[clamp(0.625rem,_0.556rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                          {selectedMember.kpi_summary?.summary_text ||
                            safeAiSummary.description}
                        </p>
                      </article>
                    </div>
                  </motion.div>
                </section>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col flex-1 w-full"
                  style={{ maxHeight: "100%" }}
                >
                  {safeRoomDataMembers.map((member, i) => (
                    <div
                      key={member.id || i}
                      className="w-full border-b border-[#9999993d] h-[clamp(2.4375rem,_2.3349rem+0.5128vh,_2.8125rem)] flex items-center justify-between cursor-pointer"
                      onClick={() => handleMemberClick(member)}
                    >
                      <section className="flex items-center gap-5">
                        <div className="w-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] h-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] relative">
                          <Image
                            src={member.avatar_url || DefaultAvatarPlaceholder}
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
                  ))}
                </motion.div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </section>
      <Chat members={roomData.members || []} />
    </main>
  );
}
