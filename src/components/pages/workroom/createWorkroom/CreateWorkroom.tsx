"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import InviteMembers from "../inviteMembers";
import AddTask from "../AddTask";
import Golive from "../Golive";
import WorkroomHeader from "../workroomHeader";
import WorkroomFooter from "../WorkroomFooter";
import CreateRoom from "../create-room";

const CreateWorkroom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentstep, setCurrentstep] = useState<number>(
    parseInt(localStorage.getItem("currentStep") || "1")
  );
  const [stepsData, setStepsData] = useState<any>(
    JSON.parse(localStorage.getItem("stepsData") || "{}")
  );
  const [workroomId, setWorkroomId] = useState<string | null>(null);

  const handleWorkroomCreated = (id: string) => {
    setWorkroomId(id);
  };

  const create_steps = [
    "Create Workroom",
    "Select team members",
    "Add task",
    "Go live !",
  ];

  useEffect(() => {
    localStorage.setItem("currentStep", currentstep.toString());
    localStorage.setItem("stepsData", JSON.stringify(stepsData));
  }, [currentstep, stepsData]);

  useEffect(() => {
    if (!pathname.includes("/workroom/create")) {
      localStorage.removeItem("currentStep");
      localStorage.removeItem("stepsData");
    }
  }, [pathname]);

  return (
    <div className="p-[clamp(1.75rem,_1.0256vw,_2.5rem)] flex flex-col gap-[clamp(1.25rem,_1.0256vw,_2rem)]">
      <WorkroomHeader
        current_step={currentstep}
        header_steps={create_steps}
        headerTitle="create workrooms"
      />

      <div className="flex flex-col neo-effect px-4 py-[clamp(1.375rem,_1.3675vw,_2.375rem)] items-center w-full h-fit mt-[clamp(1.25rem,_1.0256vw,_2rem)] gap-8">
        {/* main content */}
        {currentstep === 1 ? (
          <CreateRoom
            stepsData={stepsData}
            setStepsData={setStepsData}
            onWorkroomCreated={handleWorkroomCreated}
          />
        ) : currentstep === 2 ? (
          <InviteMembers stepsData={stepsData} setStepsData={setStepsData} />
        ) : currentstep === 3 ? (
          <AddTask
            stepsData={stepsData}
            setStepsData={setStepsData}
            workroomId={workroomId || ""}
          />
        ) : currentstep === 4 ? (
          <Golive stepsData={stepsData} setStepsData={setStepsData} />
        ) : (
          ""
        )}

        <WorkroomFooter
          current_step={currentstep}
          set_current_step={setCurrentstep}
        />
      </div>
    </div>
  );
};

export default CreateWorkroom;
