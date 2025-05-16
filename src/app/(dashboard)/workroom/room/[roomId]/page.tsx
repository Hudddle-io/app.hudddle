"use client";

import { Button } from "@/components/ui/button";
import { rooms } from "@/data/roomsData";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Trash = "/assets/trash.svg";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [roomData, setRoomData] = useState(
    rooms.filter(
      (room) =>
        room.roomName ===
        params.roomId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
    )
  );
  return (
    <main className="w-full flex flex-col gap-4 px-12 py-8">
      {/* header */}
      {roomData.map((room, i) => (
        <header
          key={i}
          className="w-full h-[clamp(2.375rem,_2.2382rem+0.6838vh,_2.875rem)
] flex justify-between items-center mb-[clamp(2.625rem,_2.4882rem+0.6838vw,_3.125rem)]"
        >
          <div id="room-name" className="flex flex-col h-full justify-between">
            <h1 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#211451] font-bold font-inria">
              {room.roomName}
            </h1>
            <Button
              variant="ghost"
              className="text-[#956FD6] w-fit p-0 h-0 text-[clamp(0.625rem,_0.5128vw,_1rem)]"
            >
              Edit workroom
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <div className="w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] bg-black rounded-full"></div>
              <div className="w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] bg-black rounded-full"></div>
              <div className="w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] bg-black rounded-full"></div>
            </span>
            <p className="text-[clamp(0.625rem,_0.1709vw,_0.75rem)] text-[#999999]">
              Ada, Tim and Scott are in this workroom
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outlined"
              className="h-full text-[clamp(0.625rem,_0.1709vw,_0.75rem)] rounded-[6px] bg-transparent ring-[#211451] text-[#211451]"
            >
              Join Workroom
            </Button>
            <Button variant="ghost" size="icon" className="w-fit p-0 h-0">
              <Image src={Trash} alt="list" width={13} height={15} />
            </Button>
          </div>
        </header>
      ))}
      {/* main */}
      {roomData.map((room, i) => (
        <section key={i}>
          <Tabs defaultValue="team-pulse" className="w-full">
            <div className="w-full flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="team-pulse">Team Pulse</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="team-pulse"
              className="w-full h-full flex gap-2 items-start "
            >
              {/* leader boards */}
              <header className="px-3 card-morph rounded-[16px] w-[clamp(16.875rem,_16.4306rem+2.2222vw,_18.5rem)] py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
                <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  Leaderboards
                </h3>

                <div className="flex flex-col gap-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  {/* users */}
                  {room.members
                    .sort((a, b) => b.points - a.points)
                    .slice(0, 4)
                    .map((m, i) => (
                      <div
                        key={i}
                        className="h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] bg-[#956fd634] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end"
                      >
                        <section className="flex items-center h-full gap-1">
                          <span className="w-[clamp(1.5rem,_1.3974rem+0.5128vw,_1.875rem)] h-[clamp(1.5rem,_1.3974rem+0.5128vh,_1.875rem)] bg-slate-900 rounded-full" />
                          <div className="h-full flex flex-col justify-between">
                            <h5 className="text-[clamp(0.525rem,_0.5566rem+0.3419vw,_0.775rem)] text-[#211451] font-bold font-inria">
                              {m.name}
                            </h5>
                            <div className="flex gap-4">
                              <span className="text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                                <Image
                                  src={"/assets/strike-full.svg"}
                                  alt="strike"
                                  width={9}
                                  height={9}
                                />
                                {m.points}
                              </span>
                              <span className="text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                                {m.tasksDone} tasks
                              </span>
                            </div>
                          </div>
                        </section>

                        <Button
                          variant="ghost"
                          className="p-0 h-0 text-[#5C5CE9] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]"
                        >
                          <Image
                            src={"/assets/ai.svg"}
                            alt="strike"
                            width={9}
                            height={9}
                          />
                          Ai Sumary
                        </Button>
                      </div>
                    ))}
                </div>
              </header>
              {/* metric overviews */}
              <div className="px-3 card-morph rounded-[16px] w-5/6 py-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)]">
                <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  Metric Overview
                </h3>
                <div className="w-full flex gap-4 h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] items-center ring-1  mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <div className="w-[173px] h-full relative">
                    <div className={"w-full h-full"}>
                      <Image src="/assets/total.svg" alt="total" fill />
                    </div>
                    <div className={"w-[100px] h-[100px]"}>
                      <Image src="/assets/available.svg" alt="total" fill />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                    KPI Pulse Monitor
                  </h3>

                  <section className="flex items-center flex-wrap gap-4">
                    <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                    <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                    <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                  </section>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="tasks"
              className="w-full grid grid-cols-2 gap-4"
            >
              My Tasks
            </TabsContent>
            <TabsContent
              value="participants"
              className="w-full grid grid-cols-2 gap-4"
            >
              Members of the room
            </TabsContent>
          </Tabs>
        </section>
      ))}
    </main>
  );
}
