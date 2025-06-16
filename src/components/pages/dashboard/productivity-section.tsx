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
import { backendUri } from "@/lib/config"; // Import backendUri
import { toast } from "@/components/ui/use-toast"; // Assuming you have toast
import { RoomMemberData } from "@/app/(dashboard)/workroom/room/[roomId]/page";

// Reuse RoomMemberData interface from page.tsx for consistency

interface ProductivitySectionProps {
  currentUser: RoomMemberData | null; // Use RoomMemberData
  // Removed onUpdateUserData from ProductivitySectionProps, as it defines and passes it down
}

const TimeLogCardContent: React.FC<TimeLogCardContentProps> = ({
  description,
  icon: Icon,
  value,
  border,
}) => (
  <CardContent className={`rounded-none ${border}`}>
    <CardDescription>{description}</CardDescription>
    <h1 className="text-[#E27522] font-bold gap-1 text-lg flex items-center">
      {description === "Your points" ? (
        <>
          {value}{" "}
          {Icon && (
            <Image src={Icon} alt={Icon + " value"} width={18} height={18} />
          )}
        </>
      ) : (
        <>
          {Icon && (
            <Image src={Icon} alt={Icon + " value"} width={18} height={18} />
          )}{" "}
          {value}
        </>
      )}
    </h1>
  </CardContent>
);

export const DailyTimeLog: React.FC<{
  currentUser: ProductivitySectionProps["currentUser"];
  // Explicitly define the type for onUpdateUserData here for DailyTimeLog
  onUpdateUserData: (data: Partial<RoomMemberData>) => Promise<void>;
}> = ({ currentUser, onUpdateUserData }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // In milliseconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const localStorageKey = "dailyActiveTime";
  const lastActiveDayKey = "lastActiveDay";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStartTime = localStorage.getItem(localStorageKey);
      const storedLastActiveDay = localStorage.getItem(lastActiveDayKey);
      const today = new Date().toDateString();

      if (storedStartTime && storedLastActiveDay === today) {
        setStartTime(parseInt(storedStartTime, 10));
      } else {
        setStartTime(Date.now());
        localStorage.setItem(lastActiveDayKey, today);
        localStorage.removeItem(localStorageKey);
      }
    }

    return () => {
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
        if (typeof window !== "undefined") {
          localStorage.setItem(localStorageKey, startTime.toString());
        }
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
      if (elapsedTime > 0 && currentUser) {
        const totalActiveMinutes = Math.floor(
          (elapsedTime + (currentUser.daily_active_minutes || 0) * 60 * 1000) /
            (1000 * 60)
        );

        onUpdateUserData({
          daily_active_minutes: totalActiveMinutes, // Send daily_active_minutes
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [elapsedTime, currentUser, onUpdateUserData]);

  const handleLogout = useCallback(() => {
    if (startTime && currentUser) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const now = Date.now();
      const finalElapsedTime = now - startTime;
      const totalActiveMinutes = Math.floor(
        (finalElapsedTime +
          (currentUser.daily_active_minutes || 0) * 60 * 1000) /
          (1000 * 60)
      );

      onUpdateUserData({
        daily_active_minutes: totalActiveMinutes, // Send daily_active_minutes
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem(localStorageKey);
      }
      setStartTime(null);
      setElapsedTime(0);
    }
  }, [startTime, currentUser, onUpdateUserData]);

  useEffect(() => {
    // This is a placeholder for actual logout integration.
    // You would typically trigger handleLogout from your application's logout button or event.
    // Example: window.addEventListener('beforeunload', handleLogout); // Use with caution.
    return () => {
      // window.removeEventListener('beforeunload', handleLogout);
    };
  }, [handleLogout]);

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
        icon={"/assets/strike-full.svg"}
        value={`${currentUser?.xp || 0}`}
      />
      <TimeLogCardContent
        description="Total hours today"
        icon={"/assets/clock.svg"}
        value={displayedTime}
        border="border-x-[1px] border-slate-200"
      />
      <TimeLogCardContent
        description="Teamwork"
        icon={"/assets/clock.svg"}
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
            {/* Note: currentUser?.average_task_time is not passed to ProductivityBadge's currentUser prop.
                It would need to be part of RoomMemberData directly if it's meant to be displayed here from the parent. */}
            {`${
              (currentUser as any)?.average_task_time_hours || 0
            } hrs per task`}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductivitySection: React.FC<ProductivitySectionProps> = ({
  currentUser,
}) => {
  const updateUserProfileData = useCallback(
    async (data: Partial<RoomMemberData>) => {
      try {
        if (typeof window === "undefined") return; // Ensure client-side only
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            description: "Authentication token not found. Please log in.",
            variant: "destructive",
          });
          return;
        }

        // Filter out undefined values to ensure only relevant fields are sent
        const payload: { [key: string]: any } = {};
        for (const key in data) {
          if (data[key as keyof Partial<RoomMemberData>] !== undefined) {
            payload[key] = data[key as keyof Partial<RoomMemberData>];
          }
        }

        const response = await fetch(
          `${backendUri}/api/v1/auth/update-profile-data`,
          {
            method: "PUT", // Changed method from PATCH to PUT as requested
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to update user profile data: ${response.status}`
          );
        }

        const result = await response.json();
        console.log("User profile data updated successfully:", result);
        // You might want to refresh currentUser state in parent if this component doesn't re-fetch it
        // toast({ description: "Profile updated successfully!", variant: "default" });
      } catch (error: any) {
        console.error("Error updating user profile data:", error);
        toast({
          description: `Failed to update profile: ${error.message}`,
          variant: "destructive",
        });
      }
    },
    [] // Dependencies for useCallback - none needed if `backendUri` and `toast` are stable
  );

  return (
    <Card className="grid gap-6 grid-cols-9 mt-3 rounded-none border-none shadow-none">
      <div className="col-span-3">
        <ProductivityBadge currentUser={currentUser} />
      </div>
      <div className="col-span-6">
        <DailyTimeLog
          currentUser={currentUser}
          onUpdateUserData={updateUserProfileData}
        />
      </div>
    </Card>
  );
};

export default ProductivitySection;
