"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import InviteMembers from "../inviteMembers";
import AddTask from "../AddTask";
import Golive from "../Golive";
import WorkroomHeader from "../workroomHeader";
import CreateRoom from "../create-room";
import { backendUri } from "@/lib/config";
import fetchWorkroomDetails from "@/lib/fetch-workroom";
import { WorkroomDetails } from "@/lib/fetch-workroom";
import CreateKpi from "../create-kpi";
import CreateWorkroomLoader from "@/components/loaders/create-workroom";
import WorkroomFooter from "../WorkroomFooter";

const CreateWorkroom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const workroomIdFromUrl = params?.roomId as string | undefined;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepsData, setStepsData] = useState<any>({});

  const [workroomId, setWorkroomId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]); // This might be redundant if AddTask fetches its own tasks or receives them via workroomData
  const [workroomData, setWorkroomData] = useState<WorkroomDetails | null>(
    null
  );
  const [roomName, setRoomName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const steps = [
    "Create Workroom",
    "Add room Kpi's",
    "Select team members",
    "Add task",
    "Go live !",
  ];

  // Set workroomId from URL if available
  useEffect(() => {
    if (workroomIdFromUrl) {
      setWorkroomId(workroomIdFromUrl);
    }
  }, [workroomIdFromUrl]);

  // Fetch workroom details (tasks, members, KPIs)
  useEffect(() => {
    const getWorkroomData = async () => {
      if (workroomId && backendUri) {
        setLoading(true);
        setError(null);
        try {
          const data: WorkroomDetails | null = await fetchWorkroomDetails(
            workroomId,
            backendUri
          );
          console.log("Data from fetchWorkroomDetails:", data);
          setWorkroomData(data); // Store the fetched data
          // Initialize roomName from fetched data, if it's the first step or we're editing
          if (data?.name) {
            setRoomName(data.name);
          }
          // Optionally, you could also set currentStep based on fetched data completeness
          // e.g., if data.kpis is empty, stay on step 2, etc.
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    getWorkroomData();
  }, [workroomId]); // Depend on workroomId to refetch data when it changes

  // Step-based component rendering
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateRoom
            type="create" // Or "edit" based on your routing logic
            setRoomName={setRoomName}
            roomName={roomName}
            stepsData={stepsData}
            setStepsData={setStepsData}
            onWorkroomCreated={setWorkroomId}
            workroomData={workroomData} // Pass workroomData here
          />
        );
      // Inside renderStepComponent in CreateWorkroom.tsx
      case 2:
        return (
          <CreateKpi
            workroomData={workroomData} // Already passed
            workroomId={workroomId} // Already passed
            setWorkroomData={setWorkroomData} // <-- Ensure this is passed
          />
        );
      case 3:
        return (
          <InviteMembers
            workroomData={workroomData} // Pass workroomData
            setWorkroomData={setWorkroomData}
            roomName={roomName}
            workroomId={workroomId}
            stepsData={stepsData}
            setStepsData={setStepsData}
          />
        );
      case 4:
        return (
          <AddTask
            setWorkroomData={setWorkroomData}
            stepsData={stepsData}
            setStepsData={setStepsData}
            workroomId={workroomId}
            tasks={tasks} // Keep tasks if AddTask still explicitly needs it, otherwise remove
          />
        );
      case 5:
        return (
          <Golive
            data={workroomData} // Already passing data as 'data' prop
            workroomId={workroomId}
            stepsData={stepsData}
            setStepsData={setStepsData}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <CreateWorkroomLoader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-[clamp(1.75rem,_1.0256vw,_2.5rem)] pb-[clamp(3rem,_2.5vw,_4rem)] flex flex-col gap-[clamp(1.25rem,_1.0256vw,_2rem)]">
      <WorkroomHeader
        type={"create"}
        current_step={currentStep}
        header_steps={steps}
        headerTitle={roomName}
      />

      <div className="flex flex-col bg-white rounded-[16px] shadow-sm px-4 py-[clamp(1.375rem,_1.3675vw,_2.5rem)] items-center w-full h-fit mt-[clamp(1.25rem,_1.0256vw,_3rem)] gap-8">
        {renderStepComponent()}
        <WorkroomFooter
          type={"create"}
          workroomId={workroomId}
          current_step={currentStep}
          set_current_step={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default CreateWorkroom;
