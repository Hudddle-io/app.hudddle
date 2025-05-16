"use client";

import { Button } from "@/components/ui/button";
import { rooms } from "@/data/roomsData";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyChart from "@/components/shared/demo-chart";
import KpiChart from "@/components/shared/kpi-chart";
import { aiSummary } from "@/data/ai-sum-data";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import MyTask from "@/app/(tasks)/your-tasks/my-task";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const Trash = "/assets/trash.svg";
const building = "/assets/building.png";
const chess = "/assets/chess.svg";
const strike = "/assets/strike-full.svg";
const clock = "/assets/clock.svg";

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
  const [activeTab, setActiveTab] = useState("team-pulse");
  const [selectedMember, setSelectedMember] = useState<any | null>(null); // Store member data
  const router = useRouter();

  const handleMemberClick = useCallback((member: any) => {
    // Take the whole member object.
    setSelectedMember(member);
    setActiveTab("participants"); // Switch to participants tab
  }, []);

  const handleBack = () => {
    setSelectedMember(null); // Clear selected member to go back to the list
  };

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
              {room.members.length > 0
                ? `${room.members[0].name} ${
                    room.members.length > 1 ? `, ${room.members[1].name}` : ""
                  } ${
                    room.members.length > 2 ? "and others" : ""
                  } are in this workroom`
                : "No members in this workroom"}
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
          <Tabs
            defaultValue="team-pulse"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
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
                        className="h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] bg-[#956fd634] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end cursor-pointer"
                        onClick={() => handleMemberClick(m)} // Pass the whole member object
                      >
                        <section className="flex items-center h-full gap-1">
                          <div className="w-[clamp(1.5rem,_1.3974rem+0.5128vw,_1.875rem)] h-[clamp(1.5rem,_1.3974rem+0.5128vh,_1.875rem)] bg-slate-900 rounded-full relative">
                            <Image fill src={m.image} alt={`${m.name}-image`} />
                          </div>
                          <div className="h-full flex flex-col justify-between">
                            <h5 className="text-[clamp(0.525rem,_0.5566rem+0.3419vw,_0.775rem)] text-[#211451] font-bold font-inria">
                              {m.name}
                            </h5>
                            <div className="flex gap-4">
                              <span className="flex items-center gap-1 text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
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
                <div className="w-full flex gap-4 h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] items-center mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <KpiChart />
                  <WeeklyChart />
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

                <div className="flex flex-col gap-4 mt-12">
                  <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                    <Image
                      src="/assets/ai.svg"
                      alt="ai"
                      width={24}
                      height={24}
                    />
                    Ai Summary
                  </h3>

                  <article className="flex flex-col gap-2">
                    <p className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                      {aiSummary.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                        Key Insights :
                      </h3>
                      <div className="flex flex-col gap-1">
                        {aiSummary.keyInsights.map((insight, i) => (
                          <p
                            key={i}
                            className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                          >
                            - {insight}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                        Recommendations
                      </h3>
                      <div className="flex flex-col gap-1">
                        {aiSummary.Recommendations.map((recommendation, i) => (
                          <p
                            key={i}
                            className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                          >
                            {i + 1}. {recommendation}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="w-full flex flex-col gap-10">
              <header className="w-full flex items-center justify-between">
                <Input
                  className="w-[clamp(18.75rem,_18.1346rem+3.0769vw,_21rem)] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                  type="search"
                  placeholder="Search ..."
                />

                <div className="flex gap-4 items-center">
                  <Button
                    variant="outline"
                    className="flex space-x-2 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                  >
                    <Image src={building} alt="" width={20} height={20} />
                    <h1>
                      <strong>
                        {3}/{9} tasks
                      </strong>{" "}
                      completed
                    </h1>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex space-x-2 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                  >
                    <h1 className="text-[#956FD6]">{6} Pending tasks</h1>
                  </Button>
                  <Button className="bg-[#211451] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]">
                    <Plus size={24} color="white" />
                    <span>Create Span</span>
                  </Button>
                </div>
              </header>

              <section className="flex flex-col gap-2">
                <MyTask tasks={room.tasks} totalItems={10} key={1} />
              </section>
            </TabsContent>
            <TabsContent
              value="participants"
              className="w-full h-full grid grid-rows-1 gap-2"
            >
              {selectedMember ? ( // Show member details if selectedMember is not null
                <section className="w-full flex gap-6">
                  <header className="w-[clamp(15rem,_14.265rem+3.6752vw,_17.6875rem)] rounded-[25px] bg-[#956fd610] px-[clamp(1.5625rem,_1.4428rem+0.5983vw,_2rem)] py-[clamp(1.25rem,_1.0962rem+0.7692vw,_1.8125rem)]">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      className="mb-4"
                    >
                      <ArrowLeft className="mr-2" size={16} /> Back to
                      Participants
                    </Button>
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <div className="w-[clamp(11.125rem,_11.0395rem+0.4274vw,_11.4375rem)] h-[clamp(11.125rem,_11.0395rem+0.4274vh,_11.4375rem)] rounded-full bg-black relative">
                        <Image
                          fill
                          src={selectedMember.image}
                          alt={selectedMember.name}
                        />
                      </div>
                      <h2 className="text-[clamp(1.5rem,_1.4145rem+0.4274vw,_1.8125rem)] text-[#211451] font-bold">
                        {selectedMember.name}
                      </h2>
                      <p className="text-[#956FD6] text-[clamp(0.8125rem,_0.727rem+0.4274vw,_1.125rem)]">
                        Level: {selectedMember.level}
                      </p>
                    </div>

                    <div
                      className="w-full flex flex-col gap-2"
                      id="leaderboards"
                    >
                      {/* leader */}
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-3">
                          <Image
                            src={chess}
                            alt="chess"
                            height={23}
                            width={12.09}
                          />
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Leader
                          </h3>
                        </span>
                        <Progress className="w-full h-[clamp(0.8125rem,_00.7783rem+0.1709vh,_0.9375rem)] bg-[#D9D9D9]" />
                      </div>
                      {/* workerholic */}
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-3">
                          <Image
                            src={chess}
                            alt="chess"
                            height={23}
                            width={12.09}
                          />
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Workaholic
                          </h3>
                        </span>
                        <Progress className="w-full h-[clamp(0.8125rem,_00.7783rem+0.1709vh,_0.9375rem)] bg-[#D9D9D9]" />
                      </div>
                      {/* team player */}
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-3">
                          <Image
                            src={chess}
                            alt="chess"
                            height={23}
                            width={12.09}
                          />
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Team Player
                          </h3>
                        </span>
                        <Progress className="w-full h-[clamp(0.8125rem,_00.7783rem+0.1709vh,_0.9375rem)] bg-[#D9D9D9]" />
                      </div>
                      {/* slacker */}
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-3">
                          <Image
                            src={chess}
                            alt="chess"
                            height={23}
                            width={12.09}
                          />
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Slacker
                          </h3>
                        </span>
                        <Progress className="w-full h-[clamp(0.8125rem,_00.7783rem+0.1709vh,_0.9375rem)] bg-[#D9D9D9]" />
                      </div>
                    </div>
                  </header>
                  <div className="w-full flex flex-col gap-2">
                    {/* first section */}
                    <section className="w-full grid grid-cols-3 grid-rows-1 card-morph h-fit min-h-[58px] rounded-[16px] mb-10">
                      <div className="flex flex-col h-fit gap-[2px] border-r border-[#999999] px-2 py-1 items-center">
                        <span className="text-[clamp(0.5rem,_0.4316rem+0.3419vw,_0.75rem)] text-[#707070]">
                          points
                        </span>
                        <h3 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] flex gap-1 text-[#E27522] font-bold">
                          {selectedMember.points}
                          <Image
                            src={strike}
                            width={14}
                            height={16}
                            alt="thunder"
                          />
                        </h3>
                      </div>
                      <div className="flex flex-col h-fit gap-[2px] border-r border-[#999999] px-2 py-1 items-center">
                        <span className="text-[clamp(0.5rem,_0.4316rem+0.3419vw,_0.75rem)] text-[#707070]">
                          Total hours today
                        </span>
                        <h3 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#E27522] font-bold flex items-center gap-[2px]">
                          <Image
                            src={clock}
                            alt="clock"
                            width={14}
                            height={14}
                          />
                          2 hours : 30 mins
                        </h3>
                      </div>
                      <div className="flex flex-col h-fit gap-[2px] border-r px-2 py-1 items-center">
                        <span className="text-[clamp(0.5rem,_0.4316rem+0.3419vw,_0.75rem)] text-[#707070]">
                          Teamwork
                        </span>
                        <h3 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#E27522] font-bold flex items-center gap-1">
                          <Image
                            src={clock}
                            alt="clock"
                            width={14}
                            height={14}
                          />
                          0 Drop-ins
                        </h3>
                      </div>
                    </section>

                    <section className="w-full h-[clamp(12.1875rem,_11.9482rem+1.1966vh,_13.0625rem)] flex items-center gap-4 mb-6">
                      <KpiChart />
                      <WeeklyChart />
                    </section>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-[#211451] text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                        KPI Pulse Monitor
                      </h3>
                      {/* {selectedMember.kpi} */}
                      <section className="flex items-center flex-wrap gap-4">
                        <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                        <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                        <div className="h-[200px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"></div>
                      </section>
                    </div>

                    <div className="flex flex-col gap-4 mt-12">
                      <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                        <Image
                          src="/assets/ai.svg"
                          alt="ai"
                          width={24}
                          height={24}
                        />
                        Ai Summary
                      </h3>

                      <article className="flex flex-col gap-2">
                        <p className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                          {aiSummary.description}
                        </p>

                        <div className="flex flex-col gap-2">
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Key Insights :
                          </h3>
                          <div className="flex flex-col gap-1">
                            {aiSummary.keyInsights.map((insight, i) => (
                              <p
                                key={i}
                                className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                              >
                                - {insight}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                            Recommendations
                          </h3>
                          <div className="flex flex-col gap-1">
                            {aiSummary.Recommendations.map(
                              (recommendation, i) => (
                                <p
                                  key={i}
                                  className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal"
                                >
                                  {i + 1}. {recommendation}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                    <p>Points: {selectedMember.points}</p>
                    <p>Tasks Done: {selectedMember.tasksDone}</p>
                    <p>KPI Alignment: {selectedMember.kpiAlignment}</p>
                    <div>
                      <h3 className="font-semibold mt-2">Room KPIs:</h3>
                      <ul>
                        {selectedMember.roomKpis.map(
                          (kpi: string, index: number) => (
                            <li key={index}>{kpi}</li>
                          )
                        )}
                      </ul>
                    </div>
                    <p>AI Summary: {selectedMember.aiSummary}</p>
                    {selectedMember.kpi && (
                      <div>
                        <h3 className="font-semibold mt-2">Member KPI:</h3>
                        <p>Name: {selectedMember.kpi.kpiName}</p>
                        <p>Metric: {selectedMember.kpi.kpiMetric}</p>
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                //  Otherwise, show the list of participants
                room.members.map((member, i) => (
                  <div
                    key={i}
                    className="w-full border-b border-[#9999993d] h-[clamp(2.4375rem,_2.3349rem+0.5128vh,_2.8125rem)] flex items-center justify-between cursor-pointer"
                    onClick={() => handleMemberClick(member)} // Pass the member
                  >
                    <section className="flex items-center gap-5">
                      <div className="w-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] h-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] rounded-full bg-black" />
                      <span className="text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] text-[#262626] font-bold">
                        {member.name}
                      </span>
                    </section>

                    <Button
                      variant="ghost"
                      className="text-red-500 hover:bg-transparent text-[clamp(0.5rem,_0.3974rem+0.5128vw,_0.875rem)]"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </section>
      ))}
    </main>
  );
}
