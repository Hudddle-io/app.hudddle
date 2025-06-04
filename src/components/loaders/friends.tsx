import React from "react";
import { Skeleton } from "../ui/skeleton"; // Assuming this path for Shadcn Skeleton
import { Card } from "../ui/card"; // Assuming this path for Shadcn Card
import { TabsList, TabsTrigger, Tabs } from "../ui/tabs"; // Assuming this path for Shadcn Tabs (for TabSwitch skeleton)

const FriendsLoader = () => {
  return (
    <>
      {/* TabSwitch Skeleton */}
      <div className="mb-5 flex justify-center">
        {" "}
        {/* Mimics TabSwitch layout */}
        <Tabs>
          <TabsList className="w-full max-w-md">
            {" "}
            {/* Adjust max-w-md if your TabSwitch is wider/narrower */}
            <TabsTrigger value="all-friends" className="flex-1">
              <Skeleton className="h-8 w-24" />{" "}
              {/* Skeleton for "All Friends" tab */}
            </TabsTrigger>
            <TabsTrigger value="pending-invites" className="flex-1">
              <Skeleton className="h-8 w-28" />{" "}
              {/* Skeleton for "Pending Invites" tab */}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Card containing Friend/Pending Card Skeletons */}
      <Card className="mt-5 p-4 border-none neo-effect">
        {Array.from({ length: 4 }).map(
          (
            _,
            index // Display 4 skeleton cards
          ) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 mb-3 last:mb-0 rounded-md"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />{" "}
                {/* Avatar skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" /> {/* Name skeleton */}
                  <Skeleton className="h-3 w-24" />{" "}
                  {/* Email/additional info skeleton */}
                </div>
              </div>
              <div className="flex space-x-2">
                {/* Buttons skeleton - adjust width based on actual button text */}
                <Skeleton className="h-9 w-20 rounded-md" />{" "}
                {/* For primary action (e.g., Accept/Remove) */}
                <Skeleton className="h-9 w-20 rounded-md" />{" "}
                {/* For secondary action (e.g., Decline) */}
              </div>
            </div>
          )
        )}
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-20">
        <nav className="inline-flex rounded-md shadow">
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
        </nav>
      </div>
    </>
  );
};

export default FriendsLoader;
