"use client";
import React from "react"; // No need for useEffect or useState
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

const WorkroomsLoader: React.FC = () => {
  // This component now simply renders the skeleton UI.
  // Its visibility (loading state) is controlled by the parent component.

  return (
    <div className="grid grid-cols-2 gap-4 w-full px-4">
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] " />{" "}
      {/* Skeleton for title */}
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)]" />{" "}
      {/* Skeleton for input */}
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] " />
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)]" />
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)]" />
      <Skeleton className="h-[clamp(7.5rem,_7.1068rem+1.9658vh,_8.9375rem)] " />{" "}
      {/* Skeleton for invite button */}
    </div>
  );
};

export const RecentWorkroomsLoader: React.FC = () => {
  return (
    <Skeleton className="w-full h-[clamp(6.25rem,_3.6752vh,_8.9375rem)]" />
  );
};

export default WorkroomsLoader;
