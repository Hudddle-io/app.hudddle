import React from "react";
import { Skeleton } from "../ui/skeleton"; // Assuming this path for Shadcn Skeleton
import { Card } from "../ui/card"; // Assuming this path for Shadcn Card

const DashboardLoader = () => {
  return (
    <section className="pt-8 pb-10 px-12">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" /> {/* For Header name */}
          <Skeleton className="h-5 w-64" /> {/* For team/company name */}
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />{" "}
        {/* For any header button/element */}
      </div>

      <div className="mt-10">
        {/* Streaks Skeleton */}
        <p className="text-right">
          <Skeleton className="h-6 w-32 ml-auto" /> {/* For Streaks text */}
        </p>

        {/* ProductivitySection Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 rounded-lg border">
          <Skeleton className="h-20 w-full md:w-1/3 mb-4 md:mb-0" />{" "}
          {/* Placeholder for a chart/main metric */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
            <Skeleton className="h-16 w-full" /> {/* For productivity */}
            <Skeleton className="h-16 w-full" /> {/* For average task time */}
            <Skeleton className="h-16 w-full" /> {/* For XP */}
            <Skeleton className="h-16 w-full" />{" "}
            {/* For daily active minutes */}
            <Skeleton className="h-16 w-full col-span-2" />{" "}
            {/* For teamwork collaborations */}
          </div>
        </div>

        {/* StatsCard Grid Skeleton */}
        <div className="w-full grid grid-cols-2 gap-x-10 gap-y-5 mt-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" /> // Placeholder for each StatsCard
          ))}
        </div>

        {/* Today's Task Header & Search Skeleton */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
          <Skeleton className="h-8 w-64 mb-4 sm:mb-0" />{" "}
          {/* For Today's task heading */}
          <Skeleton className="h-10 w-64 rounded-lg" /> {/* For search input */}
        </div>

        {/* Tasks Card Skeleton */}
        <Card className="mt-5 p-4 border-none max-h-60 overflow-hidden neo-effect">
          {Array.from({ length: 3 }).map(
            (
              _,
              index // Show a few task skeletons
            ) => (
              <div key={index} className="mb-4 last:mb-0">
                <Skeleton className="h-12 w-full rounded-md" />{" "}
                {/* Placeholder for each TodaysTask */}
              </div>
            )
          )}
        </Card>

        {/* Pagination Skeleton (if enough items to show) */}
        <div className="flex justify-center mt-4">
          <div className="inline-flex rounded-md shadow">
            <Skeleton className="px-3 py-1 rounded-l-md h-8 w-20" />{" "}
            {/* Previous button */}
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium h-8 w-8 ml-1"
              /> // Page numbers
            ))}
            <Skeleton className="px-3 py-1 rounded-r-md h-8 w-16 ml-1" />{" "}
            {/* Next button */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLoader;
