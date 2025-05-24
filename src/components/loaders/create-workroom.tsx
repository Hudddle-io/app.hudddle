"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CreateWorkroomLoader: React.FC = () => {
  return (
    <div className="w-full h-screen rounded-[16px] ">
      {/* header */}
      <div className="w-full">
        {" "}
        {/* Mimics the Header component's container */}
        <div className="flex flex-col gap-4">
          {" "}
          {/* Mimics HeaderTexts */}
          <div className="flex items-center">
            {/* Skeleton for the Button and MoveLeft icon */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* Button */}
            {/* No need for MoveLeft icon itself, as the button skeleton covers it */}
            {/* Skeleton for the header title and description */}
            <div className="ml-4 flex flex-col gap-1">
              <Skeleton className="h-6 w-[200px]" /> {/* headerTitle */}
              <Skeleton className="h-4 w-[300px]" /> {/* description */}
            </div>
          </div>
          <div className="flex items-center gap-2 pl-8 mt-4">
            {/* Skeletons for each header step (e.g., 3 steps) */}
            {[1, 2, 3].map(
              (
                _,
                i // Assuming a fixed number of steps for skeleton
              ) => (
                <div
                  key={i}
                  className="flex flex-col justify-between h-[clamp(1.375rem,_1.3675vh,_2.375rem)]"
                >
                  {/* Skeleton for the Progress bar */}
                  <Skeleton className="w-[clamp(11.8125rem,_3.3906vw,_14.2919rem)] h-2 rounded-full bg-gray-200" />
                  {/* Skeleton for the step text */}
                  <Skeleton className="h-4 w-[80px] mt-2" />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="h-[clamp(22.25rem,_19.0598vh,_36.1875rem)] w-full flex items-center justify-center">
        <div className="w-full flex flex-col gap-[clamp(1.25rem,_1.0256vw,_2rem)] items-center">
          {/* Skeleton for the Label */}
          <Skeleton className="h-6 w-[clamp(10rem,_8vw,_15rem)]" />

          {/* Skeleton for the Input */}
          <Skeleton className="w-[60%] h-[clamp(2.375rem,_1.8803vh,_3.75rem)]" />

          {/* Skeleton for the Button */}
          <Skeleton className="bg-gray-300 mt-2 w-[clamp(12.5rem,_8.547vw,_18.75rem)] h-[clamp(2.rem,_1.7094vh,_2.5rem)]" />
        </div>
      </div>

      <footer className="flex w-full justify-between mt-10">
        {/* Skeleton for the "previous" button */}
        <Skeleton className="h-[clamp(2.25rem,_1.3675vh,_3.25rem)] w-[clamp(6.25rem,_2.906vw,_8.375rem)] rounded-md" />

        {/* Skeleton for the "next" button */}
        <Skeleton className="h-[clamp(2.25rem,_1.3675vh,_3.25rem)] w-[clamp(6.25rem,_2.906vw,_8.375rem)] rounded-md" />
      </footer>
    </div>
  );
};

export default CreateWorkroomLoader;
