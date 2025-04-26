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
import { useUserSession } from "@/contexts/useUserSession";
import { TaskTodayProps } from "@/lib/@types";

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
  first_name: string;
  last_name: string;
  email: string;
  // ... other user properties
  productivity: number;
  average_task_time: number;
  xp: number;
  daily_active_minutes: number;
  teamwork_collaborations: number;
}

const levelDescriptions: Record<UserLevelData["category"], string> = {
  Leader: "Create more tasks and delegate effectively to boost your leadership score.",
  Workaholic: "Complete tasks on time and consistently to increase your workaholic level.",
  "Team Player": "Collaborate on tasks and accept invites to enhance your team player status.",
  Slacker: "Improve your task completion rate and stay active daily to avoid being a slacker.",
};

const PageDashboard: React.FC = () => {
  const { currentUser, loading, error } = useUserSession();
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const [isLoadingLevels, setIsLoadingLevels] = useState(true);
  const [isUpdatingActiveMinutes, setIsUpdatingActiveMinutes] = useState(false);
  const [todaysTasks, setTodaysTasks] = useState<TaskTodayProps[]>([]);
  const [userStreak, setUserStreak] = useState<UserStreakData | null>(null);
  const [userLevels, setUserLevels] = useState<UserLevelData[]>([]);

  const updateDailyActiveMinutes = async (minutes: number) => {
    if (!currentUser?.id || isUpdatingActiveMinutes) {
      return;
    }
    setIsUpdatingActiveMinutes(true);
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const response = await fetch(
        `https://hudddle-backend.onrender.com/api/v1/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({ daily_active_minutes: minutes }),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to update daily active minutes:",
          response.status,
          response.statusText
        );
        // Optionally handle error (e.g., retry, display message)
      } else {
        console.log("Daily active minutes updated successfully:", minutes);
        // You might want to update the local currentUser state if needed
        // For example, by refetching user data or updating a local copy
      }
    } catch (error) {
      console.error("Error updating daily active minutes:", error);
    } finally {
      setIsUpdatingActiveMinutes(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    const fetchDashboardData = async () => {
      setIsLoadingStreak(true);
      setIsLoadingLevels(true);
      try {
        const tasksResponse = await fetch(
          "https://hudddle-backend.onrender.com/api/v1/tasks",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        if (!tasksResponse.ok) {
          console.error(
            "Failed to fetch tasks:",
            tasksResponse.status,
            tasksResponse.statusText
          );
        } else {
          const tasksData = await tasksResponse.json();
          const today = new Date().toISOString().split("T")[0];
          const todaysFilteredTasks = tasksData
            .filter((task: any) => task.deadline.split("T")[0] === today)
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
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }

      try {
        const streakResponse = await fetch(
          "https://hudddle-backend.onrender.com/api/v1/achievements/users/me/streak",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        if (!streakResponse.ok) {
          console.error(
            "Failed to fetch streak data:",
            streakResponse.status,
            streakResponse.statusText
          );
          setUserStreak(null);
        } else {
          const streakData: UserStreakData = await streakResponse.json();
          console.log(`Streak Data: ${streakData.current_streak}`);
          setUserStreak(streakData);
        }
      } catch (err) {
        console.error("Error fetching streak data:", err);
        setUserStreak(null);
      } finally {
        setIsLoadingStreak(false);
      }

      try {
        const levelsResponse = await fetch(
          "https://hudddle-backend.onrender.com/api/v1/achievements/users/me/levels",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        if (!levelsResponse.ok) {
          console.error(
            "Failed to fetch level data:",
            levelsResponse.status,
            levelsResponse.statusText
          );
          setUserLevels([]);
        } else {
          const levelsData: UserLevelData[] = await levelsResponse.json();
          console.log("Level Data:", levelsData);
          setUserLevels(levelsData);
        }
      } catch (err) {
        console.error("Error fetching level data:", err);
        setUserLevels([]);
      } finally {
        setIsLoadingLevels(false);
      }
    };

    fetchDashboardData();
  }, []);

  // if (loading || isLoadingLevels || isLoadingStreak) return <div>Loading...</div>;
  // if (error) return <div>Error:{error}</div>;

  const levelImageMap: Record<UserLevelData["category"], string | undefined> = {
    Leader: statsCardsData.find(stat => stat.title === "Leader")?.image,
    Workaholic: statsCardsData.find(stat => stat.title === "Workaholic")?.image,
    "Team Player": statsCardsData.find(stat => stat.title === "Team Player")?.image,
    Slacker: statsCardsData.find(stat => stat.title === "Slacker")?.image,
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
          Streaks: <span className="text-custom-yellow">{userStreak?.current_streak || 0}</span>
          {/* {userStreak?.highest_streak && (
            <span className="text-sm text-gray-500 ml-2">
              (Highest: {userStreak.highest_streak})
            </span>
          )} */}
        </p>
        <ProductivitySection currentUser={currentUser} updateDailyActiveMinutes={updateDailyActiveMinutes} />
        {currentUser && (
          <h1 className="mt-10 font-bold text-slate-600 text-xl">
            Weekly Stats
          </h1>
        )}
        <div className="grid grid-cols-2 mt-2 gap-x-10 gap-y-5">
          {userLevels.map((level) => {
            const matchingStat = statsCardsData.find(
              (stat) => stat.title === level.category
            );
            return (
              <StatsCard
                key={level.category}
                image={matchingStat?.image}
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
            );
          })}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <h1 className="font-bold text-slate-600 text-xl">Today's task for {currentUser?.email}
          </h1>
          <SlidersHorizontal
            size={18}
            color="#D9D9D9"
            className="cursor-pointer"
          />
        </div>
        <Card className="mt-5 p-4 border-none max-h-60 overflow-y-auto neo-effect">
          {todaysTasks.map((task, index) => (
            <TodaysTask key={index} task={task} />
          ))}
          {todaysTasks.length === 0 && (
            <p className="text-slate-500">No tasks for today.</p>
          )}
        </Card>
      </div>
    </section>
  );
};

export default PageDashboard;

// "use client";
// import React, { useContext, useEffect, useState } from "react";
// import Header from "./header";
// import ProductivitySection from "./productivity-section";
// import StatsCard from "./stats-card";
// import { statsCardsData, tasksData } from "@/data/data";
// import { SlidersHorizontal } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import TodaysTask from "./todays-task";
// import { Metadata } from "next";
// import { getToken } from "@/utils";
// import { AuthContext } from "@/contexts/AuthContext";

// export const metadata: Metadata = {
//   title: "Hudddle | Dashboard",
// };
// const PageDashboard: React.FC = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const token = getToken();
//         console.log(token);
//         if (!token){
//           throw new Error("No access token found");
//         }
//         const response = await fetch("https://hudddle-backend.onrender.com/api/v1/auth/me", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         console.log(response);
//         if (!response.ok) {
//           const errorResponse = await response.json();
//           throw new Error(`${response.status} - ${errorResponse.message}`);
//         };
//         const userData = await response.json();
//         setCurrentUser(userData);
//         console.log(userData);
//         return userData;
       
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getCurrentUser();
//   }, []);


//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }
//   return (
//     <section className="pt-8 pb-10 px-12">
//       <Header
//         name="Esther"
//         isInWorkroom={false}
//         teamName="Design Team"
//         companyName="Atlassian Incorporated"
//       />
//       <div className="mt-10">
//         <p></p>
//         <p className="text-custom-semiBlack font-semibold text-right">
//           Streaks <span className="text-custom-yellow">5 days</span>
//         </p>
//         <ProductivitySection />
//         {currentUser && (
//           <h1 className="mt-10 font-bold text-slate-600 text-xl">
//             Welcome, {currentUser.name}
            
//           </h1>
//         )}
//         <div className="grid grid-cols-2 mt-2 gap-x-10 gap-y-5">
//           {statsCardsData.map((stat, index) => (
//             <StatsCard
//               key={index}
//               image={stat.image}
//               title={stat.title}
//               description={stat.description}
//               progressValue={stat.progressValue}
//               progressColor={stat.progressColor}
//             />
//           ))}
//         </div>

//         <div className="mt-10 flex justify-between items-center">
//           <h1 className="font-bold text-slate-600 text-xl">Today's task</h1>
//           <SlidersHorizontal
//             size={18}
//             color="#D9D9D9"
//             className="cursor-pointer"
//           />
//         </div>
//         <Card className="mt-5 p-4 border-none max-h-60 overflow-y-auto neo-effect">
//           {tasksData.map((task, index) => (
//             <TodaysTask key={index} task={task} />
//           ))}
//         </Card>
//       </div>
//     </section>
//   );
// };

// export default PageDashboard;
// // import React, { useEffect } from "react";
// // import Header from "./header";
// // import ProductivitySection from "./productivity-section";
// // import StatsCard from "./stats-card";
// // import { statsCardsData, tasksData } from "@/data/data";
// // import { SlidersHorizontal } from "lucide-react";
// // import { Card } from "@/components/ui/card";
// // import TodaysTask from "./todays-task";
// // import { Metadata } from "next";

// // export const metadata: Metadata = {
// //   title: "Hudddle | Dashboard",
// //   //description: "Generated by create next app",
// // };

// // const PageDashboard: React.FC = () => {
// //   const getCurrentUser = async () => {
// //     try {
// //       const token=process.env.HUDDLE_ACCESS_TOKEN;
// //       const response = await fetch("https://hudddle-backend.onrender.com/api/v1/auth/me", {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}`,
// //         }
// //       });
  
// //       if (!response.ok) {
// //         throw new Error(`Error: ${response.status} ${response.statusText}`);
// //       }
// //       const userData = await response.json();
// //       console.log("User Data:", userData);
// //       return userData;
// //     } catch (error) {
// //       console.error("Failed to fetch user data:", error);
// //     }
// //   };

// //  const currentUser = getCurrentUser();
  
// //  console.log(currentUser);
// //   return (
// //     <section className="pt-8 pb-10 px-12">
// //       <Header
// //         name="Esther"
// //         isInWorkroom={false}
// //         teamName="Design Team"
// //         companyName="Atlassian Incorporated"
// //       />
// //       <div className="mt-10">
// //         <p className="text-custom-semiBlack font-semibold text-right">
// //           Streaks <span className="text-custom-yellow">5 days</span>
// //         </p>
// //         <ProductivitySection />
// //         <h1 className="mt-10 font-bold text-slate-600 text-xl">{currentUser}</h1>
// //         <div className="grid grid-cols-2 mt-2 gap-x-10 gap-y-5">
// //           {statsCardsData.map((stat, index) => (
// //             <StatsCard
// //               key={index}
// //               image={stat.image}
// //               title={stat.title}
// //               description={stat.description}
// //               progressValue={stat.progressValue}
// //               progressColor={stat.progressColor}
// //             />
// //           ))}
// //         </div>

// //         <div className="mt-10 flex justify-between items-center">
// //           <h1 className="font-bold text-slate-600 text-xl">Today's task</h1>
// //           <SlidersHorizontal
// //             size={18}
// //             color="#D9D9D9"
// //             className="cursor-pointer"
// //           />
// //         </div>
// //         <Card className="mt-5 p-4 border-none max-h-60 overflow-y-auto neo-effect">
// //           {tasksData.map((task, index) => (
// //             <TodaysTask key={index} task={task} />
// //           ))}
// //         </Card>
// //       </div>
// //     </section>
// //   );
// // };

// // export default PageDashboard;
