"use client";

// Removed the global declaration for 'window.chrome' as it's no longer used for this specific button

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyChart from "@/components/shared/demo-chart";
import KpiChart from "@/components/shared/kpi-chart";
import { Input } from "@/components/ui/input"; // Corrected import for Input
import { Plus, Zap, X } from "lucide-react";
import type { Task as UserTask } from "@/app/(tasks)/your-tasks/my-task";
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

import {
  Task as WorkroomTaskRow,
  TaskActions as WorkroomTaskActions,
  TaskDueTime as WorkroomTaskDueTime,
  TaskTitle as WorkroomTaskTitle,
} from "@/components/pages/workroom/Task";

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
import CreateWorkroomTaskSheet from "@/components/shared/create-workroom-task";
import { Loader } from "lucide-react";

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

  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [allRoomTasks, setAllRoomTasks] = useState<TaskTodayProps[]>([]);

  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loadingUserTasks, setLoadingUserTasks] = useState(false);
  const [userTasksError, setUserTasksError] = useState<string | null>(null);
  const [loadingMember, setLoadingMember] = useState<string | null>(null);
  const [selectedMemberTasks, setSelectedMemberTasks] = useState<UserTask[]>(
    []
  );
  const [memberTasksFetchUnavailable, setMemberTasksFetchUnavailable] =
    useState(false);

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
    if (activeTab !== "tasks") return;

    const fetchUserTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserTasksError("Authorization token is missing");
        return;
      }

      setLoadingUserTasks(true);
      setUserTasksError(null);
      try {
        const response = await fetch(
          `${backendUri}/api/v1/tasks?page=1&page_size=1000`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data: UserTask[] = await response.json();
        setUserTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching user tasks:", error);
        setUserTasks([]);
        setUserTasksError("Failed to load your tasks.");
      } finally {
        setLoadingUserTasks(false);
      }
    };

    fetchUserTasks();
  }, [activeTab]);

  const addExistingTaskToWorkroom = async (taskId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        description: "Authorization token is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${backendUri}/api/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workroom_id: params.roomId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task to workroom");
      }

      await refreshRoomData();
      setUserTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error adding task to workroom:", error);
      toast({
        description: "Failed to add task to workroom.",
        variant: "destructive",
      });
    }
  };

  type TaskLike = TaskTodayProps | UserTask;

  const selectedMemberTasksOnly = useMemo<UserTask[]>(() => {
    if (!selectedMember) return [];

    const normalizeId = (value: unknown) =>
      value === null || value === undefined ? null : String(value);

    const memberId = normalizeId(selectedMember.id);
    const tasks = selectedMemberTasks || [];

    // Defensive filtering: some APIs may return extra tasks.
    // BUT in this app, "member's task" can mean assigned-to, not only created-by.
    // So we match against a broader set of potential task owner/assignee fields.
    return tasks.filter((t: any) => {
      const candidateIds = [
        t?.created_by_id,
        t?.createdById,
        t?.created_by?.id,
        t?.createdBy?.id,
        t?.user_id,
        t?.userId,
        t?.user?.id,
        t?.owner_id,
        t?.ownerId,
        t?.owner?.id,
        t?.assignee_id,
        t?.assigneeId,
        t?.assignee?.id,
        t?.assigned_to_id,
        t?.assignedToId,
        t?.assigned_to?.id,
        t?.assignedTo?.id,
      ]
        .map(normalizeId)
        .filter(Boolean) as string[];

      // If the API doesn't provide any id fields, don't throw the task away.
      if (candidateIds.length === 0) return true;
      if (!memberId) return true;

      return candidateIds.includes(memberId);
    });
  }, [selectedMember, selectedMemberTasks]);

  const selectedMemberTasksInThisWorkroom = useMemo<UserTask[]>(() => {
    if (!selectedMember) return [];
    return selectedMemberTasksOnly.filter(
      (t) =>
        String(
          (t as any).workroom_id ??
            (t as any).workroomId ??
            (t as any).workroom?.id ??
            ""
        ) === String(params.roomId)
    );
  }, [selectedMember, selectedMemberTasksOnly, params.roomId]);

  const selectedMemberTasksNotInThisWorkroom = useMemo<UserTask[]>(() => {
    if (!selectedMember) return [];
    return selectedMemberTasksOnly.filter(
      (t) =>
        String(
          (t as any).workroom_id ??
            (t as any).workroomId ??
            (t as any).workroom?.id ??
            ""
        ) !== String(params.roomId)
    );
  }, [selectedMember, selectedMemberTasksOnly, params.roomId]);

  const inWorkroomTasksToDisplay = useMemo<TaskLike[]>(() => {
    const base: TaskLike[] = selectedMember
      ? (selectedMemberTasksInThisWorkroom as TaskLike[])
      : (allRoomTasks as TaskLike[]);

    let tempTasks = [...base];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tempTasks = tempTasks.filter((task) =>
        (task as any).title?.toLowerCase().includes(term)
      );
    }

    tempTasks.sort((a: any, b: any) => {
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return tempTasks;
  }, [
    allRoomTasks,
    searchTerm,
    selectedMember,
    selectedMemberTasksInThisWorkroom,
  ]);

  const safeRoomDataMembers = roomData?.members || [];
  const safeAiSummary = aiSummary || {
    description: "",
    keyInsights: [],
    Recommendations: [],
  };

  const handleMemberClick = async (member: RoomMemberData) => {
    setLoadingMember(member.name);
    setSelectedMember(member);
    setMemberTasksFetchUnavailable(false);

    const taskBelongsToMember = (task: any, memberId: string) => {
      const normalizeId = (value: unknown) =>
        value === null || value === undefined ? null : String(value);

      const id = normalizeId(memberId);
      if (!id) return false;

      const directIds = [
        task?.created_by_id,
        task?.createdById,
        task?.user_id,
        task?.userId,
        task?.owner_id,
        task?.ownerId,
        task?.assignee_id,
        task?.assigneeId,
        task?.assigned_to_id,
        task?.assignedToId,
      ]
        .map(normalizeId)
        .filter(Boolean) as string[];

      const assignedIdsRaw =
        task?.assigned_user_ids ?? task?.assignedUserIds ?? task?.assigned_to;
      const assignedIds = Array.isArray(assignedIdsRaw)
        ? (assignedIdsRaw.map(normalizeId).filter(Boolean) as string[])
        : [];

      return directIds.includes(id) || assignedIds.includes(id);
    };

    const fallbackToWorkroomTasks = () => {
      const fallbackTasks = (roomData?.tasks || []).filter((t: any) =>
        taskBelongsToMember(t, member.id)
      );
      setSelectedMemberTasks(fallbackTasks);
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token missing");

      const response = await fetch(
        `${backendUri}/api/v1/users/${member.id}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        // Backend doesn't implement this endpoint in your environment.
        setMemberTasksFetchUnavailable(true);
        fallbackToWorkroomTasks();
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch member tasks");

      const tasks = await response.json();
      setSelectedMemberTasks(Array.isArray(tasks) ? tasks : tasks.tasks || []);
    } catch (error) {
      console.error("Error fetching member tasks:", error);
      fallbackToWorkroomTasks();
    } finally {
      setLoadingMember(null);
    }
  };

  const handleBack = () => {
    setSelectedMember(null);
    setSelectedMemberTasks([]);
  };

  const allTasksNotInThisWorkroom = useMemo(() => {
    return userTasks.filter((t) => t.workroom_id !== params.roomId);
  }, [userTasks, params.roomId]);

  const tasksNotInThisWorkroomToDisplay = useMemo<UserTask[]>(() => {
    return selectedMember
      ? selectedMemberTasksNotInThisWorkroom
      : allTasksNotInThisWorkroom;
  }, [
    selectedMember,
    selectedMemberTasksNotInThisWorkroom,
    allTasksNotInThisWorkroom,
  ]);

  if (!roomData) {
    // Simplified loading state as extensionStatus.isLoading is removed
    return <RoomLoader />;
  }

  // Removed isUseInRoomButtonDisabled as it's no longer tied to extension status
  // The button will now always attempt to send to the Electron app, and the fetch
  // error handling will indicate if the Electron app is not running.

  const handleUseInRoom = async () => {
    const workroomId = params.roomId;

    // Array of common ports desktop apps might use
    const portsToTry = [3001, 3000, 3002, 8080, 8081, 5000, 5001, 9000];

    // Array of possible protocol schemes
    const protocolSchemes = [
      "hudddle-desktop://",
      "hudddle://",
      "huddledeskop:", // typo variation
      "hudddle-app://",
    ];

    let connectionSuccessful = false;

    // Helper function to try HTTP connection on a specific port
    const tryHttpConnection = async (port: number): Promise<boolean> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout

        // Try POST request with JSON body
        const response = await fetch(
          `http://localhost:${port}/api/connect-workroom`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ workroomId }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log(`✓ Connected via HTTP on port ${port}:`, data);
          toast({
            description:
              data.message || "Successfully connected to desktop app!",
            variant: "default",
          });
          return true;
        }
        return false;
      } catch (error) {
        // Port not available or app not responding
        return false;
      }
    };

    // Helper function to try protocol handler
    const tryProtocolHandler = (scheme: string): void => {
      try {
        // Method 1: Create an invisible iframe (works better on Mac)
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.src = `${scheme}connect-workroom?workroomId=${encodeURIComponent(
          workroomId
        )}`;
        document.body.appendChild(iframe);

        // Clean up after a short delay
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 2000);

        console.log(`✓ Tried protocol: ${scheme}`);
      } catch (error) {
        console.log(`✗ Protocol ${scheme} failed:`, error);
      }
    };

    // STRATEGY 1: Try HTTP connections on common ports
    console.log("🔍 Scanning for desktop app on common ports...");

    for (const port of portsToTry) {
      const success = await tryHttpConnection(port);
      if (success) {
        connectionSuccessful = true;
        return; // Exit early if connection successful
      }
    }

    // STRATEGY 2: Try protocol handlers (works without knowing the port)
    console.log("🔍 Trying protocol handlers...");

    for (const scheme of protocolSchemes) {
      tryProtocolHandler(scheme);
    }

    if (!connectionSuccessful) {
      toast({
        description:
          "Attempting to connect to desktop app... If the app doesn't open, please ensure it's installed and running.",
        variant: "default",
      });

      // STRATEGY 3: Wait and retry HTTP connections (in case desktop app is starting)
      setTimeout(async () => {
        console.log("🔄 Retrying HTTP connections...");

        for (const port of portsToTry) {
          const success = await tryHttpConnection(port);
          if (success) {
            return; // Exit if retry successful
          }
        }

        // If still not connected after retry, show warning
        console.warn("⚠ Desktop app not detected after retry");
        toast({
          description:
            "Could not connect to desktop app. Please ensure Hudddle Desktop is installed and running.",
          variant: "destructive",
        });
      }, 3000); // Wait 3 seconds for desktop app to start
    }
  };

  const levelCategories: UserLevelCategory[] = [
    "Leader",
    "Workaholic",
    "Team Player",
    "Slacker",
  ];

  return (
    <main className="w-full flex flex-col gap-4 px-4 md:px-8 2xl:px-12 py-6 md:py-8 relative">
      {loadingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin text-[#956FD6]" />
            <p className="text-[#211451] font-semibold text-lg">
              You&apos;re selecting {loadingMember}
            </p>
          </div>
        </div>
      )}
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
          <Button
            variant="ghost"
            onClick={() => router.push("/workroom")}
            className="text-[9px]"
          >
            <ArrowLeft className="stroke-[1px] text-[#4D4D4D] mr-1" />
            back
          </Button>
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

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-full bg-[#956FD6] hover:bg-[#805AD5] text-white rounded-[6px] text-[clamp(0.625rem,_0.1709vw,_0.75rem)]"
            onClick={handleUseInRoom}
          >
            Use in room
          </Button>
          <Button
            variant="outline"
            className="rounded-[6px] h-full text-[clamp(0.625rem,_0.1709vw,_0.75rem)]"
            onClick={() => router.push("/workroom")}
          >
            Leave room
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
              className="w-full flex-1 flex flex-col lg:flex-row gap-3 lg:gap-4 items-stretch lg:items-start pt-2 md:pt-3 min-h-[calc(100vh-150px)]"
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:sticky lg:top-4 self-start flex-shrink-0 w-full lg:w-auto"
                style={{ maxHeight: "calc(100vh - 120px)" }}
              >
                <header
                  id="leader-board"
                  className="px-2 sm:px-3 card-morph rounded-[16px] w-full lg:w-[clamp(16.875rem,_16.4306rem+2.2222vw,_18.5rem)] py-4 sm:py-6 h-full overflow-y-auto custom-scrollbar"
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
                      .map((m: LeaderboardDisplayMember, i) => {
                        const memberId =
                          (m as RoomMemberData).id ||
                          (m as LeaderboardEntry).user_id ||
                          "";

                        const isSelected =
                          !!selectedMember && memberId === selectedMember.id;

                        return (
                          <div
                            key={memberId || i}
                            data-is-selected={isSelected}
                            className={`h-auto min-h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end cursor-pointer ${
                              isSelected
                                ? "bg-primary-hudddleLight"
                                : "hover:bg-[#956fd634]"
                            }`}
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
                                <h5
                                  className={`text-[clamp(0.525rem,_0.5566rem+0.3419vw,_0.775rem)] font-bold font-inria ${
                                    isSelected ? "text-white" : "text-[#211451]"
                                  }`}
                                >
                                  {(m as RoomMemberData).name ||
                                    (m as LeaderboardEntry).user_name}
                                </h5>
                                <div className="flex gap-4">
                                  <span
                                    className={`flex items-center gap-1 text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)] ${
                                      isSelected
                                        ? "text-white/90"
                                        : "text-[#211451]"
                                    }`}
                                  >
                                    <Image
                                      src={"/assets/strike-full.svg"}
                                      alt="strike"
                                      width={9}
                                      height={9}
                                      style={{ width: "auto", height: "auto" }}
                                    />
                                    {(m as RoomMemberData).xp ??
                                      (m as LeaderboardEntry).score}{" "}
                                  </span>
                                  <span
                                    className={`text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)] ${
                                      isSelected
                                        ? "text-white/90"
                                        : "text-[#211451]"
                                    }`}
                                  >
                                    {(m as RoomMemberData).productivity ??
                                      (m as LeaderboardEntry).task_score}{" "}
                                    tasks
                                  </span>
                                </div>
                              </div>
                            </section>

                            <Button
                              variant="ghost"
                              className={`p-0 h-0 text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)] ${
                                isSelected ? "text-white" : "text-[#5C5CE9]"
                              }`}
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
                        );
                      })}
                  </div>
                </header>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 px-2 sm:px-3 card-morph rounded-[16px] py-4 sm:py-6 overflow-y-auto custom-scrollbar h-full"
              >
                <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-2">
                  Metric overview
                </h3>
                <div className="w-full flex flex-col md:flex-row gap-4 md:items-stretch mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <div className="w-full md:w-[220px] shrink-0">
                    <KpiChart
                      overallAlignmentPercentage={
                        selectedMember?.kpi_summary
                          ?.overall_alignment_percentage ||
                        roomData.workroom_kpi_summary
                          ?.overall_alignment_percentage ||
                        0
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <WeeklyChart
                      historyData={
                        selectedMember?.kpi_metric_history ||
                        roomData.workroom_kpi_metric_history ||
                        []
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-2">
                    KPI Pulse Monitor
                  </h3>
                  <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
                    {(() => {
                      const memberBreakdown =
                        selectedMember?.kpi_summary?.kpi_breakdown;
                      const roomBreakdown =
                        roomData.workroom_kpi_summary?.kpi_breakdown;

                      if (
                        Array.isArray(memberBreakdown) &&
                        memberBreakdown.length > 0
                      ) {
                        return memberBreakdown.map((entry, i) => (
                          <div
                            key={`${entry.kpi_name}-${i}`}
                            className="min-h-[220px] w-full rounded-[20px] border-2 border-custom-purple bg-custom-lightBlue/40 flex flex-col items-center justify-between px-4 pt-5 pb-6"
                          >
                            <MetricChart
                              kpiName={entry.kpi_name}
                              weight={entry.weight || 0}
                              percentage={entry.percentage}
                            />
                            <span className="text-center w-full text-sm font-semibold text-[#211451]">
                              {entry.kpi_name}
                            </span>
                          </div>
                        ));
                      }

                      if (roomBreakdown) {
                        return Object.entries(roomBreakdown).map(
                          ([kpi_name, percentage], i) => (
                            <div
                              key={`${kpi_name}-${i}`}
                              className="min-h-[220px] w-full rounded-[20px] border-2 border-custom-purple bg-custom-lightBlue/40 flex flex-col items-center justify-between px-4 pt-5 pb-6"
                            >
                              <MetricChart
                                kpiName={kpi_name}
                                weight={percentage / 10 || 0}
                                percentage={percentage}
                              />
                              <span className="text-center w-full text-sm font-semibold text-[#211451]">
                                {kpi_name}
                              </span>
                            </div>
                          )
                        );
                      }

                      return null;
                    })()}
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
                      {selectedMember?.kpi_summary?.summary_text ||
                        safeAiSummary.description}
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
              className="w-full flex flex-col gap-8 overflow-y-auto custom-scrollbar flex-1 min-h-[calc(100vh-150px)]"
            >
              <header className="w-full flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 xl:gap-6">
                <Input
                  className="w-full xl:w-[clamp(18.75rem,_18.1346rem+3.0769vw,_21rem)] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                  type="search"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="flex flex-wrap gap-3 xl:gap-4 items-center justify-start xl:justify-end">
                  {selectedMember && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#E5E7EB] text-[#211451]"
                      onClick={handleBack}
                    >
                      <span className="truncate max-w-[220px]">
                        Showing: {selectedMember.name}
                      </span>
                      <X className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-4 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]">
                    <Image src={building} alt="" width={20} height={20} />
                    <span className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451]">
                      <strong>
                        {roomData.completed_task_count || 0}/
                        {(roomData.completed_task_count || 0) +
                          (roomData.pending_task_count || 0)}{" "}
                        tasks
                      </strong>{" "}
                      completed
                    </span>
                  </div>

                  <div className="flex items-center rounded-[10px] border border-[#E5E7EB] bg-white px-4 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]">
                    <span className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#956FD6]">
                      {roomData.pending_task_count || 0} pending tasks
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Button
                      className="bg-[#956FD6] text-white h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                      onClick={() => setIsCreateTaskSheetOpen(true)}
                    >
                      <Plus className="w-[18px] h-[18px] mr-2" /> Create Task
                    </Button>

                    <CreateWorkroomTaskSheet
                      isOpen={isCreateTaskSheetOpen}
                      workroomId={params.roomId}
                      onClose={() => setIsCreateTaskSheetOpen(false)}
                      onTaskCreated={() => {
                        // Ensure the new task shows up immediately in the in-room list
                        refreshRoomData();
                      }}
                    />
                  </div>
                </div>
              </header>

              <section className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                  <h4 className="text-[clamp(0.75rem,_0.6838vw,_1rem)] font-semibold text-[#5C5CE9]">
                    In Workroom
                  </h4>
                  <div className="flex flex-col">
                    {inWorkroomTasksToDisplay.length > 0 ? (
                      inWorkroomTasksToDisplay.map((task: any) => (
                        <WorkroomTaskRow
                          key={task.id}
                          className="py-4 border-[#E5E7EB]"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-3 h-3 rounded-full border border-[#D1D5DB] mt-1 shrink-0" />
                            <div className="min-w-0">
                              <WorkroomTaskTitle className="max-w-none truncate">
                                {task.title}
                              </WorkroomTaskTitle>
                              <WorkroomTaskDueTime>
                                {(task as any).due_by ||
                                  (task as any).deadline ||
                                  ""}
                              </WorkroomTaskDueTime>
                            </div>
                          </div>
                          <WorkroomTaskActions>
                            <span className="text-[#EEAE05] text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] flex items-center">
                              +<Zap width={12} height={12} />
                              {(task as any).task_point ??
                                (task as any).points ??
                                0}
                            </span>
                          </WorkroomTaskActions>
                        </WorkroomTaskRow>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        {selectedMember
                          ? `No tasks found for ${selectedMember.name}.`
                          : "No tasks found."}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-[clamp(0.75rem,_0.6838vw,_1rem)] font-semibold text-[#956FD6]">
                    All Tasks
                  </h4>
                  <div className="flex flex-col">
                    {selectedMember ? (
                      tasksNotInThisWorkroomToDisplay.length > 0 ? (
                        tasksNotInThisWorkroomToDisplay.map((task) => (
                          <WorkroomTaskRow
                            key={task.id}
                            className="py-4 border-[#E5E7EB]"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-3 h-3 rounded-full border border-[#D1D5DB] mt-1 shrink-0" />
                              <div className="min-w-0">
                                <WorkroomTaskTitle className="max-w-none truncate">
                                  {task.title}
                                </WorkroomTaskTitle>
                                <WorkroomTaskDueTime>
                                  {task.due_by || task.deadline || ""}
                                </WorkroomTaskDueTime>
                              </div>
                            </div>
                            <WorkroomTaskActions>
                              <span className="text-[#EEAE05] text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] flex items-center">
                                +<Zap width={12} height={12} />
                                {task.task_point ?? 0}
                              </span>
                            </WorkroomTaskActions>
                          </WorkroomTaskRow>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          {memberTasksFetchUnavailable
                            ? "Only in-workroom tasks are available for this member."
                            : "No available tasks."}
                        </p>
                      )
                    ) : loadingUserTasks ? (
                      <p className="text-center text-gray-500 py-4">
                        Loading tasks...
                      </p>
                    ) : userTasksError ? (
                      <p className="text-center text-gray-500 py-4">
                        {userTasksError}
                      </p>
                    ) : tasksNotInThisWorkroomToDisplay.length > 0 ? (
                      tasksNotInThisWorkroomToDisplay.map((task) => (
                        <WorkroomTaskRow
                          key={task.id}
                          className="py-4 border-[#E5E7EB]"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-3 h-3 rounded-full border border-[#D1D5DB] mt-1 shrink-0" />
                            <div className="min-w-0">
                              <WorkroomTaskTitle className="max-w-none truncate">
                                {task.title}
                              </WorkroomTaskTitle>
                              <WorkroomTaskDueTime>
                                {task.due_by || task.deadline || ""}
                              </WorkroomTaskDueTime>
                            </div>
                          </div>
                          <WorkroomTaskActions>
                            <span className="text-[#EEAE05] text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] flex items-center">
                              +<Zap width={12} height={12} />
                              {task.task_point ?? 0}
                            </span>
                            <Button
                              variant="outline"
                              className="border-[#E5E7EB] text-[#956FD6]"
                              onClick={() => addExistingTaskToWorkroom(task.id)}
                            >
                              <Plus className="w-[18px] h-[18px]" /> Add to
                              workroom
                            </Button>
                          </WorkroomTaskActions>
                        </WorkroomTaskRow>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No available tasks to add.
                      </p>
                    )}
                  </div>
                </div>
              </section>
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
                    <section className="w-full h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] flex items-stretch gap-4 mb-6">
                      <div className="w-[220px] shrink-0 h-full">
                        <KpiChart
                          overallAlignmentPercentage={
                            selectedMember.kpi_summary
                              ?.overall_alignment_percentage || 0
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0 h-full">
                        <WeeklyChart
                          historyData={selectedMember.kpi_metric_history || []}
                        />
                      </div>
                    </section>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-2">
                        KPI Pulse Monitor
                      </h3>
                      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                        {selectedMember.kpi_summary &&
                        selectedMember.kpi_summary.kpi_breakdown &&
                        selectedMember.kpi_summary.kpi_breakdown.length > 0 ? (
                          selectedMember.kpi_summary.kpi_breakdown.map(
                            (metric, i) => (
                              <div
                                key={i}
                                className="min-h-[220px] w-full ring-1 rounded-[16px] ring-[#956FD6] bg-transparent flex flex-col items-center justify-center p-4"
                              >
                                <MetricChart
                                  kpiName={metric.kpi_name}
                                  weight={metric.weight || 0}
                                  percentage={metric.percentage}
                                />
                                <span className="text-center w-full text-xs font-medium text-[#211451]">
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
