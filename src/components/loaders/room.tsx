import React from "react";
import { MoveLeft, Plus } from "lucide-react"; // Lucide icons
import { Skeleton } from "../ui/skeleton";
import { Tabs, TabsList } from "../ui/tabs";

// Dummy MetricChart component to prevent errors, replace with your actual component
const MetricChart = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
    <Skeleton className="h-4 w-24 mb-2" />
    <Skeleton className="h-4 w-16" />
  </div>
);

const RoomLoader = () => {
  return (
    <main className="w-full flex flex-col gap-4 px-12 py-8 font-inter">
      {/* header */}
      <header className="w-full h-[clamp(2.375rem,_2.2382rem+0.6838vh,_2.875rem)] flex justify-between items-center mb-[clamp(2.625rem,_2.4882rem+0.6838vw,_3.125rem)]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div id="room-name" className="flex flex-col h-full justify-between">
            <Skeleton className="h-6 w-48 mb-1" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className={`w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] rounded-full`}
              />
            ))}
          </span>
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-center gap-1 relative">
          <Skeleton className="h-full w-24 rounded-[6px]" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </header>
      {/* main */}
      <section>
        <div className="w-full flex items-center justify-between">
          <Tabs>
            <TabsList>
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md ml-2" />
              <Skeleton className="h-10 w-24 rounded-md ml-2" />
            </TabsList>
          </Tabs>
        </div>
        {/* team-pulse content skeleton */}
        <div className="w-full h-full flex gap-2 items-start mt-4">
          {/* leader boards skeleton */}
          <header className="px-3 card-morph rounded-[16px] w-[clamp(16.875rem,_16.4306rem+2.2222vw,_18.5rem)] py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex flex-col gap-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] w-full"
                />
              ))}
            </div>
          </header>
          {/* metric overviews skeleton */}
          <div className="px-3 card-morph rounded-[16px] w-5/6 py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="w-full flex gap-4 h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] items-center mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
              <Skeleton className="w-1/2 h-full rounded-md" />
              <Skeleton className="w-1/2 h-full rounded-md" />
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40 mb-4" />
              <section className="flex items-center flex-wrap gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[250px] w-[200px] rounded-md"
                  />
                ))}
              </section>
            </div>

            <div className="flex flex-col gap-4 mt-12">
              <Skeleton className="h-6 w-32 mb-4" />
              <article className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
        {/* tasks content skeleton - hidden by default, but included for completeness */}
        <div className="w-full flex flex-col gap-10 mt-4">
          <header className="w-full flex items-center justify-between">
            <Skeleton className="w-[clamp(18.75rem,_18.1346rem+3.0769vw,_21rem)] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] rounded-md" />
            <div className="flex gap-4 items-center">
              <Skeleton className="h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] w-32 rounded-md" />
              <Skeleton className="h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] w-32 rounded-md" />
              <Skeleton className="h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)] w-32 rounded-md" />
            </div>
          </header>
          <section className="flex flex-col gap-2">
            <Skeleton className="w-full h-40 rounded-md" />
          </section>
        </div>
        {/* participants content skeleton - hidden by default, but included for completeness */}
        <div className="w-full h-full grid grid-rows-1 gap-2 mt-4 ">
          <div className="w-full flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-[clamp(2.4375rem,_2.3349rem+0.5128vh,_2.8125rem)] rounded-md"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RoomLoader;
