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
import { TaskTodayProps } from "@/lib/@types";
import { backendUri } from "@/lib/config";
import LoadingPage from "@/components/shared/loading-page";

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

interface UserData {
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
    if (!storedToken) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUri}/api/v1/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch dashboard data:", response.status);
          return;
        }

        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));

        // Safely handle undefined user fields
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

        // Safely handle undefined tasks
        const tasks = data.daily_tasks || [];
        const today = new Date().toISOString().split("T")[0];
        const todaysFilteredTasks = tasks
          .filter((task: any) => task.deadline?.split("T")[0] === today)
          .map((task: any) => ({
            title: task.title,
            time: task.due_by
              ? new Date(task.due_by).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            points: task.task_point,
          }));
        setTodaysTasks(todaysFilteredTasks);

        // Safely handle undefined streak fields
        const streak = {
          current_streak: data.streaks || 0,
          highest_streak: data.highest_streak || 0,
          last_active_date: data.last_active_date || null,
        };
        setUserStreak(streak);

        // Safely handle undefined levels and populate missing fields
        const levels = (data.levels || []).map(
          (level: Partial<UserLevelData>) => ({
            category: level.category || "Slacker", // Default to "Slacker" if category is missing
            tier: level.tier || "Beginner", // Default tier if missing
            points: level.points || 0, // Default points to 0 if missing
          })
        );
        console.log("Processed Levels:", levels); // Debugging log
        setUserLevels(levels);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingPage loadingText="Loading your dashboard" />;

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
    <section className="pt-8 pb-10 px-12">
      <Header
        name={currentUser?.first_name || "Guest"}
        isInWorkroom={false}
        teamName="Design Team"
        companyName="Atlassian Incorporated"
      />
      <div className="mt-10">
        <p className="text-custom-semiBlack font-semibold text-right">
          Streaks:{" "}
          <span className="text-custom-yellow">
            {userStreak?.current_streak || 0}
          </span>
        </p>
        <ProductivitySection
          currentUser={
            currentUser
              ? {
                  productivity: currentUser.productivity_percentage,
                  average_task_time: currentUser.average_task_time_hours,
                  xp: currentUser.xp,
                  daily_active_minutes: currentUser.daily_active_minutes,
                  teamwork_collaborations: currentUser.teamwork_collaborations,
                }
              : null
          }
          updateDailyActiveMinutes={(minutes) => {
            if (currentUser) {
              setCurrentUser({ ...currentUser, daily_active_minutes: minutes });
            }
          }}
        />
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
        <div className="mt-10 flex justify-between items-center">
          <h1 className="font-bold text-slate-600 text-xl">
            Today's task for {currentUser?.first_name}
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
          {currentTasks.map((task, index) => (
            <TodaysTask key={index} task={task} />
          ))}
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
