"use client";
import React, { useEffect, useMemo, useState } from "react";
import Header from "./header";
import ProductivitySection from "./productivity-section";
import StatsCard from "./stats-card";
import { statsCardsData } from "@/data/data";
import { SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import TodaysTask from "./todays-task";
import { Metadata } from "next";
import { TaskTodayProps } from "@/lib/@types"; // Your combined TaskTodayProps interface
import { backendUri } from "@/lib/config";
import DashboardLoader from "@/components/loaders/dashboard";
import { useUserSession } from "@/contexts/useUserSession";

export const metadata: Metadata = {
  title: "Hudddle | Dashboard",
};

interface UserStreakData {
  current_streak: number;
  highest_streak: number;
  last_active_date: string | null;
}

type UserLevelCategory = "Leader" | "Workaholic" | "Team Player" | "Slacker";

type WeeklyStatCard = {
  category: UserLevelCategory;
  progress: number; // 0-100
  description: string;
};

export interface UserData {
  id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  productivity_percentage: number;
  average_task_time_hours: number;
  xp: number;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  avatar_url: string | null;
  friends: any[];
}

// Interface for a single friend object
export interface FriendData {
  id: string;
  created_at: string;
  updated_at: string;
  auth_provider: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role: string;
  xp: number;
  level: number;
  avatar_url: string;
  is_verified: boolean;
  is_user_onboarded: boolean;
  productivity: number;
  average_task_time: number;
  user_type: string;
  find_us: string;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  software_used: string[];
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const normalizeStatus = (status: unknown) =>
  String(status || "")
    .trim()
    .toUpperCase();

const PageDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const { currentUser, loading: userLoading } = useUserSession();
  const [todaysTasks, setTodaysTasks] = useState<TaskTodayProps[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [workroomNameById, setWorkroomNameById] = useState<
    Record<string, string>
  >({});
  const [userStreak, setUserStreak] = useState<UserStreakData | null>({
    current_streak: 0,
    highest_streak: 0,
    last_active_date: null,
  });
  const [friends, setFriends] = useState<FriendData[]>([]); // New state for friends
  const [loading, setLoading] = useState(true);

  const filteredTasks = todaysTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false); // Stop loading if no token
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // --- Fetch Tasks from a separate endpoint ---
        const tasksResponse = await fetch(`${backendUri}/api/v1/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!tasksResponse.ok) {
          console.error("Failed to fetch tasks:", tasksResponse.status);
          // If tasks fetch fails, todaysTasks will remain an empty array, which is handled
        } else {
          const tasksData = await tasksResponse.json();
          const allTasks = Array.isArray(tasksData) ? tasksData : [];
          setAllTasks(allTasks);

          const todaysFilteredAndSortedTasks: TaskTodayProps[] = allTasks
            .filter((task: any) => {
              if (!task.due_by) return false;
              const taskDate = new Date(task.due_by).toDateString();
              const todayDate = new Date().toDateString();
              return taskDate === todayDate;
            })
            .sort((a: any, b: any) => {
              const dateA = new Date(a.due_by);
              const dateB = new Date(b.due_by);
              return dateA.getTime() - dateB.getTime();
            })
            .map((task: any) => ({
              // IMPORTANT: Populate ALL properties required by TaskTodayProps (including those from 'Task' interface)
              // These are based on common properties and the errors you've reported.
              // YOU MUST VERIFY these against your actual 'Task' interface definition in @/lib/@types.ts
              id: task.id || "",
              created_at: task.created_at || "",
              updated_at: task.updated_at || "",
              user_id: task.user_id || "",
              workroom_id: task.workroom_id || null,
              due_by: task.due_by, // Explicitly used by TodaysTasks component
              description: task.description || "",
              status: task.status || "pending",
              priority: task.priority || "medium",
              comments: task.comments || [],
              assigned_to: task.assigned_to || [],
              category: task.category || "General",
              duration: task.duration || null,
              is_recurring: task.is_recurring || false,
              task_tools: task.task_tools || [],
              deadline: task.deadline || null,
              attachments: task.attachments || [],
              sub_tasks: task.sub_tasks || [],
              comments_count: task.comments_count || 0,

              // --- Properties explicitly listed as missing in the *latest* error ---
              task_point: task.task_point || 0, // This is likely where 'points' comes from
              completed_at: task.completed_at || null, // Assuming it can be null if not completed
              created_by_id: task.created_by_id || "", // Assuming this is an ID string

              // Properties specific to TaskTodayProps (which you manually add/format)
              title: task.title, // Assumed to be present and correct
              time: task.due_by
                ? new Date(task.due_by).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A",
              points: task.task_point, // Still used for display, derived from task_point
            }));
          setTodaysTasks(todaysFilteredAndSortedTasks);
        }

        // --- Fetch friends data ---
        const friendsResponse = await fetch(
          `${backendUri}/api/v1/friends/friends`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!friendsResponse.ok) {
          console.error(
            "Failed to fetch friends data:",
            friendsResponse.status
          );
        } else {
          const friendsData: FriendData[] = await friendsResponse.json();
          setFriends(friendsData);
        }

        // --- Fetch workrooms so tasks can show room names ---
        try {
          const workroomsResponse = await fetch(
            `${backendUri}/api/v1/workrooms/all`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (!workroomsResponse.ok) {
            console.error(
              "Failed to fetch workrooms:",
              workroomsResponse.status
            );
          } else {
            const workroomsData = await workroomsResponse.json();
            const workrooms = Array.isArray(workroomsData?.workrooms)
              ? workroomsData.workrooms
              : [];

            const mapping: Record<string, string> = {};
            for (const room of workrooms) {
              if (!room?.id) continue;
              mapping[String(room.id)] =
                String(room.title || "").trim() || "Untitled Room";
            }
            setWorkroomNameById(mapping);
          }
        } catch (e) {
          console.error("Error fetching workrooms:", e);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // Ensure loading is stopped regardless of success or failure
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  const levelImageMap: Record<UserLevelCategory, string> = {
    Leader:
      statsCardsData.find((stat) => stat.title === "Leader")?.image ||
      "default-leader.png",
    Workaholic:
      statsCardsData.find((stat) => stat.title === "Workaholic")?.image ||
      "default-workaholic.png",
    "Team Player":
      statsCardsData.find((stat) => stat.title === "Team Player")?.image ||
      "default-teamplayer.png",
    Slacker:
      statsCardsData.find((stat) => stat.title === "Slacker")?.image ||
      "default-slacker.png",
  };

  const weeklyStatCards: WeeklyStatCard[] = useMemo(() => {
    const averageHoursPerTask = Number.isFinite(
      (currentUser as any)?.average_task_time_hours
    )
      ? (currentUser as any).average_task_time_hours
      : 0;

    const dropIns = Number.isFinite(
      (currentUser as any)?.teamwork_collaborations
    )
      ? (currentUser as any).teamwork_collaborations
      : 0;

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const createdById =
      (currentUser as any)?.id != null ? String((currentUser as any).id) : null;

    const completedThisWeekCount = allTasks.filter((t: any) => {
      const status = normalizeStatus(t?.status);
      if (status !== "COMPLETED") return false;
      const completedAt = t?.completed_at ? new Date(t.completed_at) : null;
      return completedAt instanceof Date && !Number.isNaN(completedAt.getTime())
        ? completedAt >= weekAgo
        : false;
    }).length;

    const createdThisWeekCount = allTasks.filter((t: any) => {
      if (!createdById) return false;
      const creator = t?.created_by_id != null ? String(t.created_by_id) : "";
      if (creator !== createdById) return false;
      const createdAt = t?.created_at ? new Date(t.created_at) : null;
      return createdAt instanceof Date && !Number.isNaN(createdAt.getTime())
        ? createdAt >= weekAgo
        : false;
    }).length;

    const overdueOpenCount = allTasks.filter((t: any) => {
      const status = normalizeStatus(t?.status);
      if (status === "COMPLETED") return false;
      if (!t?.due_by) return false;
      const due = new Date(t.due_by);
      if (Number.isNaN(due.getTime())) return false;
      return due < now;
    }).length;

    // Heuristic progress scoring (0-100). These can be tuned as backend metrics mature.
    const leaderProgress = clamp((createdThisWeekCount / 20) * 100);
    const workaholicProgress = clamp((completedThisWeekCount / 15) * 100);
    const teamPlayerProgress = clamp((dropIns / 50) * 100);
    const slackerProgress = clamp((overdueOpenCount / 10) * 100);

    const hrsLabel = `${averageHoursPerTask || 0}hrs per task`;

    return [
      {
        category: "Leader",
        progress: leaderProgress,
        description: hrsLabel,
      },
      {
        category: "Team Player",
        progress: teamPlayerProgress,
        description: `${dropIns}/50 Drop-ins this week`,
      },
      {
        category: "Workaholic",
        progress: workaholicProgress,
        description: hrsLabel,
      },
      {
        category: "Slacker",
        progress: slackerProgress,
        description: hrsLabel,
      },
    ];
  }, [allTasks, currentUser]);

  const overallProductivity = useMemo(() => {
    const get = (category: UserLevelCategory) =>
      weeklyStatCards.find((c) => c.category === category)?.progress ?? 0;

    const leader = get("Leader");
    const teamPlayer = get("Team Player");
    const workaholic = get("Workaholic");
    const slacker = get("Slacker");

    // Assumption: higher slacker score means less productive.
    const slackerContribution = 100 - slacker;
    return Math.round(
      (leader + teamPlayer + workaholic + slackerContribution) / 4
    );
  }, [weeklyStatCards]);

  if (userLoading || loading) return <DashboardLoader />;

  return (
    <section className="pt-14 pb-10 px-12 overflow-y-scroll">
      <Header
        friends={friends}
        name={currentUser?.first_name || "Guest"}
        isInWorkroom={false}
        teamName="Design Team"
        companyName="Atlassian Incorporated"
      />
      <div className="mt-10">
        <p className="text-gray-500 font-semibold text-right">
          Streak:{" "}
          <span className="text-primary-hudddleLight">
            {userStreak?.current_streak || 0}{" "}
            {(userStreak?.current_streak ?? 0) > 1 ? "days" : "day"}
          </span>
        </p>
        <ProductivitySection
          currentUser={
            currentUser
              ? {
                  id: String(currentUser.id),
                  name: currentUser.first_name ?? "Guest",
                  avatar_url: currentUser.avatar_url ?? "",
                  email: currentUser.email,
                  productivity: overallProductivity,
                  average_task_time_hours: currentUser.average_task_time_hours,
                  xp: currentUser.xp,
                  daily_active_minutes: currentUser.daily_active_minutes,
                  teamwork_collaborations: currentUser.teamwork_collaborations,
                  level: 1, // Provide a default or map from userLevels if available

                  // Add any other required RoomMemberData properties with defaults or mapped values
                }
              : null
          }
        />
        <div>
          <h2 className="text-2xl capitalize pt-10 font-bold text-primary-hudddleLight">
            weekly stats
          </h2>
          <div className="w-full grid grid-cols-2 gap-x-10 gap-y-5 mt-10">
            {weeklyStatCards.map((level) => (
              <StatsCard
                key={level.category}
                image={levelImageMap[level.category]}
                title={level.category}
                description={level.description}
                progressValue={level.progress}
                progressColor={
                  level.category === "Leader"
                    ? "#F97316"
                    : level.category === "Workaholic"
                    ? "#84CC16"
                    : level.category === "Team Player"
                    ? "#2563EB"
                    : "#EC4899"
                }
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-between items-center">
          <h1 className="font-bold text-slate-600 text-xl">
            Today&apos;s task for {currentUser?.first_name}
          </h1>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card className="mt-5 p-4 border-none max-h-60 overflow-y-auto neo-effect">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              // Ensure task.id is stable and unique for the key
              <TodaysTask
                key={task.id || task.title}
                task={task}
                workroomName={
                  task.workroom_id
                    ? workroomNameById[String(task.workroom_id)]
                    : undefined
                }
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks for today!</p>
          )}
        </Card>
        {filteredTasks.length > tasksPerPage && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                      currentPage === number
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageDashboard;
