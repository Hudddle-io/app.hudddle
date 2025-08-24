"use client";
import React, { useEffect, useState } from "react";
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

export const metadata: Metadata = {
  title: "Hudddle | Dashboard",
};

interface UserStreakData {
  current_streak: number;
  highest_streak: number;
  last_active_date: string | null;
}

interface UserLevelData {
  category: "Leader" | "Workaholic" | "Team Player" | "Slacker";
  tier: string;
  points: number;
}

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

const levelDescriptions: Record<UserLevelData["category"], string> = {
  Leader:
    "Create more tasks and delegate effectively to boost your leadership score.",
  Workaholic:
    "Complete tasks on time and consistently to increase your workaholic level.",
  "Team Player":
    "Collaborate on tasks and accept invites to enhance your team player status.",
  Slacker:
    "Improve your task completion rate and stay active daily to avoid being a slacker.",
};

const PageDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<TaskTodayProps[]>([]);
  const [userStreak, setUserStreak] = useState<UserStreakData | null>(null);
  const [userLevels, setUserLevels] = useState<UserLevelData[]>([]);
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
        // --- Fetch User Data, Streak, and Levels from dashboard endpoint ---
        const dashboardResponse = await fetch(
          `${backendUri}/api/v1/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!dashboardResponse.ok) {
          console.error(
            "Failed to fetch dashboard data:",
            dashboardResponse.status
          );
          // Don't stop loading if dashboard fails, but handle the error
        } else {
          const data = await dashboardResponse.json();
          localStorage.setItem("user", JSON.stringify(data));

          const user: UserData = {
            id: data.id || 0,
            username: data.username || null,
            first_name: data.first_name || "Guest",
            last_name: data.last_name || "",
            email: data.email || "",
            productivity_percentage: data.productivity_percentage || 0,
            average_task_time_hours: data.average_task_time_hours || 0,
            xp: data.xp || 0,
            daily_active_minutes: data.daily_active_minutes || 0,
            teamwork_collaborations: data.teamwork_collaborations || 0,
            avatar_url: data.avatar_url || null,
            friends: data.friends || [],
          };
          setCurrentUser(user);

          const streak = {
            current_streak: data.streaks || 0,
            highest_streak: data.highest_streak || 0,
            last_active_date: data.last_active_date || null,
          };
          setUserStreak(streak);

          const levels = (data.levels || []).map(
            (level: Partial<UserLevelData>) => ({
              category: level.category || "Slacker",
              tier: level.tier || "Beginner",
              points: level.points || 0,
            })
          );
          setUserLevels(levels);
        }

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

          const today = new Date();
          const todayYear = today.getFullYear();
          const todayMonth = today.getMonth();
          const todayDay = today.getDate();

          const todaysFilteredAndSortedTasks: TaskTodayProps[] = allTasks
            .filter((task: any) => {
              if (!task.due_by) return false;
              const taskDueDate = new Date(task.due_by);
              return (
                taskDueDate.getFullYear() === todayYear &&
                taskDueDate.getMonth() === todayMonth &&
                taskDueDate.getDate() === todayDay
              );
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
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false); // Ensure loading is stopped regardless of success or failure
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <DashboardLoader />;

  const levelImageMap: Record<UserLevelData["category"], string> = {
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
            {userStreak?.current_streak || 0} days
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
                  productivity: currentUser.productivity_percentage,
                  average_task_time: currentUser.average_task_time_hours,
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
            {userLevels.map((level) => (
              <StatsCard
                key={level.category}
                image={levelImageMap[level.category]}
                title={level.category}
                description={levelDescriptions[level.category]}
                progressValue={level.points}
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
              <TodaysTask key={task.id || task.title} task={task} />
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
