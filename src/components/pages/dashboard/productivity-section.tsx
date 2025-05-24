"use client";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Clock4, Zap } from "lucide-react";
import { TimeLogCardContentProps } from "@/lib/@types";

interface ProductivitySectionProps {
  currentUser: {
    productivity: number;
    average_task_time: number;
    xp: number;
    daily_active_minutes: number; // This will now primarily be the value from the backend on initial load
    teamwork_collaborations: number;
  } | null;
  updateDailyActiveMinutes: (minutes: number) => void; // Function to send updated time to the backend
}

const TimeLogCardContent: React.FC<TimeLogCardContentProps> = ({
  description,
  icon: Icon,
  value,
  border,
}) => (
  <CardContent className={`rounded-none ${border}`}>
    <CardDescription>{description}</CardDescription>
    <h1 className="text-custom-yellow font-bold gap-1 text-lg flex items-center">
      {description === "Your points" ? (
        <>
          {value} {Icon && <Icon size={18} color="#EEAE05" fill="#EEAE05" />}
        </>
      ) : (
        <>
          {Icon && <Icon size={18} color="#EEAE05" />} {value}
        </>
      )}
    </h1>
  </CardContent>
);

const DailyTimeLog: React.FC<{
  currentUser: ProductivitySectionProps["currentUser"];
  updateDailyActiveMinutes: ProductivitySectionProps["updateDailyActiveMinutes"];
}> = ({ currentUser, updateDailyActiveMinutes }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // In milliseconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const localStorageKey = "dailyActiveTime";
  const lastActiveDayKey = "lastActiveDay";

  useEffect(() => {
    // Load previous session data if it's the same day
    const storedStartTime = localStorage.getItem(localStorageKey);
    const storedLastActiveDay = localStorage.getItem(lastActiveDayKey);
    const today = new Date().toDateString();

    if (storedStartTime && storedLastActiveDay === today) {
      setStartTime(parseInt(storedStartTime, 10));
    } else {
      // Start new tracking
      setStartTime(Date.now());
      localStorage.setItem(lastActiveDayKey, today);
      localStorage.removeItem(localStorageKey); // Clear any old start time
    }

    return () => {
      // Cleanup on unmount (though logout handling is more important)
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const currentElapsedTime = now - startTime;
        setElapsedTime(currentElapsedTime);
        localStorage.setItem(localStorageKey, startTime.toString());
      }, 1000); // Update every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setElapsedTime(0);
    }
  }, [startTime]);

  useEffect(() => {
    // Send updated time to backend periodically (e.g., every 5 minutes)
    const interval = setInterval(() => {
      if (elapsedTime > 0) {
        // Calculate total active minutes including previously recorded minutes from backend
        const totalActiveMinutes = Math.floor(
          (elapsedTime + (currentUser?.daily_active_minutes || 0) * 60 * 1000) /
            (1000 * 60)
        );
        updateDailyActiveMinutes(totalActiveMinutes);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [
    elapsedTime,
    currentUser?.daily_active_minutes,
    updateDailyActiveMinutes,
  ]);

  // Wrap handleLogout in useCallback
  const handleLogout = useCallback(() => {
    if (startTime) {
      clearInterval(intervalRef.current!);
      const now = Date.now();
      const finalElapsedTime = now - startTime;
      const totalActiveMinutes = Math.floor(
        (finalElapsedTime +
          (currentUser?.daily_active_minutes || 0) * 60 * 1000) /
          (1000 * 60)
      );
      updateDailyActiveMinutes(totalActiveMinutes);
      localStorage.removeItem(localStorageKey);
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [startTime, currentUser?.daily_active_minutes, updateDailyActiveMinutes]); // Add dependencies

  // Attach logout handler (you might need to adjust this based on your actual logout mechanism)
  useEffect(() => {
    // Example: Assuming you have a global logout event or function
    const handleGlobalLogout = () => {
      handleLogout();
    };

    // You might need to listen to a specific event or call handleLogout directly
    // For instance, if you have a logout button, call handleLogout on its click.

    // This is a placeholder - adapt to your actual logout logic
    // window.addEventListener('beforeunload', handleLogout); // Consider this carefully, it might not always be reliable

    return () => {
      // window.removeEventListener('beforeunload', handleLogout);
    };
  }, [handleLogout]); // Now depends on the memoized handleLogout

  const formatElapsedTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}hr ${minutes}mins`;
  };

  const displayedTime = startTime
    ? formatElapsedTime(elapsedTime)
    : formatElapsedTime((currentUser?.daily_active_minutes || 0) * 60 * 1000);

  return (
    <Card className="border-none rounded-md p-4 grid grid-cols-3 h-full neo-effect">
      <TimeLogCardContent
        description="Your points"
        icon={Zap}
        value={`${currentUser?.xp || 0}`}
      />
      <TimeLogCardContent
        description="Total hours today"
        icon={Clock4}
        value={displayedTime}
        border="border-x-[1px] border-slate-200"
      />
      <TimeLogCardContent
        description="Teamwork"
        icon={Clock4}
        value={`${currentUser?.teamwork_collaborations || 0} drop-ins`}
      />
    </Card>
  );
};

const ProductivityBadge: React.FC<{
  currentUser: ProductivitySectionProps["currentUser"];
}> = ({ currentUser }) => {
  return (
    <Card className="border-none rounded-md p-4 h-full neo-effect">
      <CardContent className="p-0 flex items-center gap-5">
        <Image src={"/assets/chess.svg"} alt="chess" width={30} height={30} />
        <div>
          <CardTitle className="text-xl font-semibold text-custom-semiBlack p-0">
            {currentUser?.productivity || 0}%{" "}
            <span className="font-bold">productive</span>
          </CardTitle>
          <CardDescription>
            {`${currentUser?.average_task_time || 0} hrs per task`}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductivitySection: React.FC<ProductivitySectionProps> = ({
  currentUser,
  updateDailyActiveMinutes,
}) => {
  return (
    <Card className="grid gap-6 grid-cols-9 mt-3 rounded-none border-none shadow-none">
      <div className="col-span-3">
        <ProductivityBadge currentUser={currentUser} />
      </div>
      <div className="col-span-6">
        <DailyTimeLog
          currentUser={currentUser}
          updateDailyActiveMinutes={updateDailyActiveMinutes}
        />
      </div>
    </Card>
  );
};

export default ProductivitySection;
