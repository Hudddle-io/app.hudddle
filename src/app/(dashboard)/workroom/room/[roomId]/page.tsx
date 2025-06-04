"use client";

// Add this global declaration to fix the TypeScript error for 'window.chrome'
declare global {
  interface Window {
    chrome?: any;
  }
}

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyChart from "@/components/shared/demo-chart";
import KpiChart from "@/components/shared/kpi-chart";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import MyTask from "@/app/(tasks)/your-tasks/my-task";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationLink from "@/components/basics/Navigation-link";
import { MoveLeft } from "lucide-react";
import { MetricChart } from "@/components/shared/mertic-chart";
import RoomLoader from "@/components/loaders/room";
import { backendUri } from "@/lib/config";

const Trash = "/assets/trash.svg";
const building = "/assets/building.png";
const chess = "/assets/chess.svg";
const strike = "/assets/strike-full.svg";
const clock = "/assets/clock.svg";

interface RoomData {
  name?: string;
  performance_metrics?: Array<{
    kpi_name: string;
    weight: number;
  }>;
  members?: Array<{
    name: string;
    xp: number;
    productivity: number;
    avatar_url: string;
    teamwork_collaborations: number;
    // Add other member properties if needed, e.g., level, kpi, roomKpis
    level?: number;
    kpiAlignment?: string;
    kpi?: { kpiName: string; kpiMetric: string };
    roomKpis?: string[];
    aiSummary?: string;
  }>;

  completed_task_count?: number;
  pending_task_count?: number;
  tasks?: any[];
}

interface AiSummary {
  description: string;
  keyInsights: string[];
  Recommendations: string[];
}

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [activeTab, setActiveTab] = useState("team-pulse");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const router = useRouter();

  // New state for extension status
  const [extensionStatus, setExtensionStatus] = useState({
    isInstalled: false,
    isPinned: false,
    isLoading: true, // Indicate initial loading state
  });

  // IMPORTANT: Replace this with your actual Chrome Extension ID
  // You can find this on chrome://extensions/ after loading your unpacked extension.
  const EXTENSION_ID = "bfmaemghdgdgllmphhdeapoeceicnaji";

  useEffect(() => {
    async function fetchRoomData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await fetch(
          `${backendUri}/api/v1/workrooms/${params.roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch room data");
        }

        const data = await response.json();
        console.log(data);
        setRoomData(data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    }

    async function checkExtensionStatus() {
      if (
        typeof window !== "undefined" &&
        window.chrome &&
        window.chrome.runtime
      ) {
        try {
          const response = await new Promise<{
            isInstalled: boolean;
            isPinned: boolean;
          } | null>((resolve) => {
            window.chrome.runtime.sendMessage(
              EXTENSION_ID,
              { type: "CHECK_EXTENSION_STATUS" },
              (
                res: { isInstalled: boolean; isPinned: boolean } | undefined
              ) => {
                if (window.chrome.runtime.lastError) {
                  console.warn(
                    "Extension not installed or cannot be reached:",
                    window.chrome.runtime.lastError.message
                  );
                  resolve(null); // Resolve with null if extension not found
                } else {
                  resolve(res ?? null);
                }
              }
            );
          });

          if (response) {
            setExtensionStatus({
              isInstalled: response.isInstalled,
              isPinned: response.isPinned,
              isLoading: false,
            });
          } else {
            setExtensionStatus({
              isInstalled: false,
              isPinned: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error communicating with extension:", error);
          setExtensionStatus({
            isInstalled: false,
            isPinned: false,
            isLoading: false,
          });
        }
      } else {
        // Not in a Chrome browser or chrome.runtime not available
        setExtensionStatus({
          isInstalled: false,
          isPinned: false,
          isLoading: false,
        });
      }
    }

    fetchRoomData();
    checkExtensionStatus(); // Check extension status on mount
  }, [params.roomId]);

  const safeRoomDataMembers = roomData?.members || [];
  const safeAiSummary = aiSummary || {
    description: "",
    keyInsights: [],
    Recommendations: [],
  };

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setActiveTab("participants");
  };

  const handleBack = () => {
    setSelectedMember(null);
  };

  const handleUseInRoomClick = () => {
    if (
      typeof window !== "undefined" &&
      window.chrome &&
      window.chrome.runtime
    ) {
      window.chrome?.runtime?.sendMessage(EXTENSION_ID, { action: "useRoom" });
      console.log(`sent action to : ${EXTENSION_ID}`);
    } else {
      alert(
        "Please use Chrome browser with the 'Huddle In Room' extension installed and pinned."
      );
    }
  };

  if (!roomData || extensionStatus.isLoading) {
    return <RoomLoader />;
  }

  // Determine if the button should be disabled
  const isUseInRoomButtonDisabled =
    !extensionStatus.isInstalled || !extensionStatus.isPinned;

  return (
    <main className="w-full flex flex-col gap-4 px-12 py-8">
      {/* header */}
      <header className="w-full h-[clamp(2.375rem,_2.2382rem+0.6838vh,_2.875rem)] flex justify-between items-center mb-[clamp(2.625rem,_2.4882rem+0.6838vw,_3.125rem)]">
        <div className="flex items-center gap-2">
          <NavigationLink
            icon={{
              icon_component: (
                <MoveLeft className="stroke-[1px] text-[#4D4D4D]" />
              ),
              icon_position: "left",
            }}
            variant={"ghost"}
            href={"/workroom"}
            className="text-[9px]"
          >
            back
          </NavigationLink>
          <div id="room-name" className="flex flex-col h-full justify-between">
            <h1 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#211451] font-bold font-inria">
              {roomData.name || ""}
            </h1>
            <Button
              variant="ghost"
              className="text-[#956FD6] w-fit p-0 h-0 text-[clamp(0.625rem,_0.5128vw,_1rem)]"
            >
              Edit workroom
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {roomData.members &&
              roomData.members
                .slice(0, 3)
                .map((member, index) => (
                  <div
                    key={index}
                    className={`w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)] rounded-full bg-cover bg-center`}
                    style={{ backgroundImage: `url(${member.avatar_url})` }}
                  ></div>
                ))}
          </span>
          <p className="text-[clamp(0.625rem,_0.1709vw,_0.75rem)] text-[#999999]">
            {roomData.members && roomData.members.length > 0
              ? `${roomData.members[0]?.name || "Member"} ${
                  roomData.members.length > 1 && roomData.members.length <= 3
                    ? `, ${roomData.members[1]?.name || "Member"}`
                    : roomData.members.length > 3
                    ? `and ${roomData.members.length - 1} others`
                    : ""
                } are in this workroom`
              : "No members in this workroom"}
          </p>
        </div>

        <div className="flex items-center gap-1 relative">
          <Button
            id="use-room"
            variant="outline"
            className={`h-full rounded-[6px] ring-[#211451] text-[#211451] ${
              isUseInRoomButtonDisabled
                ? "opacity-50 cursor-not-allowed bg-gray-200"
                : "bg-transparent"
            } text-[clamp(0.625rem,_0.1709vw,_0.75rem)]`}
            onClick={handleUseInRoomClick}
            disabled={isUseInRoomButtonDisabled}
          >
            Use inRoom
          </Button>
          {isUseInRoomButtonDisabled && (
            <div
              className={
                "absolute p-2 bottom-0 translate-y-[65px] -translate-x-[10px] left-0 bg-black text-white w-[120px] rounded-md break-words h-fit text-[9px] capitalize font-semi-bold font-inria"
              }
            >
              Please install our Inroom extension to use this feature
            </div>
          )}
          <Button variant="ghost" size="icon" className="w-fit p-0 h-0">
            <Image src={Trash} alt="list" width={13} height={15} />
          </Button>
        </div>
      </header>
      {/* main */}
      <section>
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
                {safeRoomDataMembers
                  .sort((a, b) => b.xp - a.xp)
                  .slice(0, 4)
                  .map((m, i) => (
                    <div
                      key={i}
                      className="h-[clamp(3.75rem,_3.6303rem+0.5983vh,_4.1875rem)] rounded-[12px] bg-[#956fd634] p-[clamp(0.625rem,_0.5224rem+0.5128vw,_1rem)] flex justify-between items-end cursor-pointer"
                      onClick={() => handleMemberClick(m)}
                    >
                      <section className="flex items-center h-full gap-1">
                        <div className="w-[clamp(1.5rem,_1.3974rem+0.5128vw,_1.875rem)] h-[clamp(1.5rem,_1.3974rem+0.5128vh,_1.875rem)]  rounded-full relative">
                          <Image
                            fill
                            className="rounded-full object-cover"
                            src={m.avatar_url}
                            alt={`${m.name}-image`}
                          />
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
                              {m.xp}
                            </span>
                            <span className="text-[#211451] text-[clamp(0.4375rem,_0.3862rem+0.2564vw,_0.625rem)]">
                              {m.productivity} tasks
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
                  {(roomData?.performance_metrics ?? []).map((metric, i) => (
                    <div
                      key={i}
                      className="h-[250px] w-[200px] ring-1 rounded-md ring-[#956FD6] bg-[#956fd670]"
                    >
                      <MetricChart
                        kpiName={metric.kpi_name}
                        weight={metric.weight}
                      />
                      <span className="text-center w-full">
                        {" "}
                        {metric.kpi_name}
                      </span>
                    </div>
                  ))}
                </section>
              </div>

              <div className="flex flex-col gap-4 mt-12">
                <h3 className="text-[#211451] flex items-center gap-1 text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] font-inria mb-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)]">
                  <Image src="/assets/ai.svg" alt="ai" width={24} height={24} />
                  Ai Summary
                </h3>

                <article className="flex flex-col gap-2">
                  <p className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-normal">
                    {safeAiSummary.description}
                  </p>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                      Key Insights :
                    </h3>
                    <div className="flex flex-col gap-1">
                      {safeAiSummary.keyInsights.map((insight, i) => (
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
                      {safeAiSummary.Recommendations.map(
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
                      {roomData.completed_task_count || 0}/
                      {(roomData.completed_task_count || 0) +
                        (roomData.pending_task_count || 0)}{" "}
                      tasks
                    </strong>{" "}
                    completed
                  </h1>
                </Button>
                <Button
                  variant="outline"
                  className="flex space-x-2 h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]"
                >
                  <h1 className="text-[#956FD6]">
                    {roomData.pending_task_count || 0} Pending tasks
                  </h1>
                </Button>
                <Button className="bg-[#211451] h-[clamp(2.125rem,_2.0395rem+0.4274vw,_2.4375rem)]">
                  <Plus size={24} color="white" />
                  <span>Create Task</span>
                </Button>
              </div>
            </header>

            <section className="flex flex-col gap-2">
              <MyTask
                tasks={roomData.tasks || []}
                totalItems={10}
                key={1}
                setLoadingTasks={() => {}}
                setErrorTasks={() => {}}
                setTasks={() => {}}
              />
            </section>
          </TabsContent>
          <TabsContent
            value="participants"
            className="w-full h-full grid grid-rows-1 gap-2"
          >
            {selectedMember ? (
              <section className="w-full flex gap-6">
                <header className="w-[clamp(15rem,_14.265rem+3.6752vw,_17.6875rem)] rounded-[25px] bg-[#956fd610] px-[clamp(1.5625rem,_1.4428rem+0.5983vw,_2rem)] py-[clamp(1.25rem,_1.0962rem+0.7692vw,_1.8125rem)]">
                  <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="mr-2" size={16} /> Back to
                    Participants
                  </Button>
                  <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="w-[clamp(11.125rem,_11.0395rem+0.4274vw,_11.4375rem)] h-[clamp(11.125rem,_11.0395rem+0.4274vh,_11.4375rem)] rounded-full bg-black relative">
                      <Image
                        className="rounded-full object-cover"
                        fill
                        src={selectedMember.avatar_url} // Use image_url here
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

                  <div className="w-full flex flex-col gap-2" id="leaderboards">
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
                        {selectedMember.xp}
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
                        <Image src={clock} alt="clock" width={14} height={14} />
                        2 hours : 30 mins
                      </h3>
                    </div>
                    <div className="flex flex-col h-fit gap-[2px] border-r px-2 py-1 items-center">
                      <span className="text-[clamp(0.5rem,_0.4316rem+0.3419vw,_0.75rem)] text-[#707070]">
                        Teamwork
                      </span>
                      <h3 className="text-[clamp(1.25rem,_1.1816rem+0.3419vw,_1.5rem)] text-[#E27522] font-bold flex items-center gap-1">
                        <Image src={clock} alt="clock" width={14} height={14} />
                        {selectedMember.teamwork_collaborations} Drop-ins
                      </h3>
                    </div>
                  </section>

                  <section className="w-full h-[clamp(12.1875rem,_11.9482rem+1.1966vw,_13.0625rem)] flex items-center gap-4 mb-6">
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
                        {selectedMember.aiSummary || safeAiSummary.description}
                      </p>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] text-[#211451] font-bold">
                          Key Insights :
                        </h3>
                        <div className="flex flex-col gap-1">
                          {(
                            selectedMember.keyInsights ||
                            safeAiSummary.keyInsights
                          ).map((insight: string, i: number) => (
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
                          {(
                            selectedMember.Recommendations ||
                            safeAiSummary.Recommendations
                          ).map((recommendation: string, i: number) => (
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
                  <p>Points: {selectedMember.points}</p>
                  <p>Tasks Done: {selectedMember.tasksDone}</p>
                  <p>KPI Alignment: {selectedMember.kpiAlignment}</p>
                  <div>
                    <h3 className="font-semibold mt-2">Room KPIs:</h3>
                    <ul>
                      {selectedMember.roomKpis &&
                        selectedMember.roomKpis.map(
                          (kpi: string, index: number) => (
                            <li key={index}>{kpi}</li>
                          )
                        )}
                    </ul>
                  </div>
                  {/* <p>AI Summary: {selectedMember.aiSummary}</p>  This is handled in the article block above */}
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
              // Otherwise, show the list of participants
              safeRoomDataMembers.map((member, i) => (
                <div
                  key={i}
                  className="w-full border-b border-[#9999993d] h-[clamp(2.4375rem,_2.3349rem+0.5128vh,_2.8125rem)] flex items-center justify-between cursor-pointer"
                  onClick={() => handleMemberClick(member)} // Pass the member
                >
                  <section className="flex items-center gap-5">
                    <div className="w-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] h-[clamp(1.5625rem,_1.477rem+0.4274vw,_1.875rem)] relative">
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        fill
                        className=" rounded-full object-cover"
                      />
                    </div>
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
    </main>
  );
}
