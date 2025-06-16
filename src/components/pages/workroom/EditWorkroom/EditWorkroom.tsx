"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import InviteMembers from "../inviteMembers";
import AddTask from "../AddTask";
import Golive from "../Golive";
import WorkroomHeader from "../workroomHeader";
import WorkroomFooter from "../WorkroomFooter";
import CreateRoom from "../create-room";
import { backendUri } from "@/lib/config";
import fetchWorkroomDetails, { WorkroomDetails } from "@/lib/fetch-workroom"; // Import the interface
import CreateKpi from "../create-kpi";
import CreateWorkroomLoader from "@/components/loaders/create-workroom";

const CreateWorkroom = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const workroomIdFromUrl = params?.roomId as string | undefined;

  const [currentStep, setCurrentStep] = useState<number>(1); // Default to step 1
  const [stepsData, setStepsData] = useState<any>({}); // Default to empty object

  const [workroomId, setWorkroomId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [workroomData, setWorkroomData] = useState<WorkroomDetails | null>(
    null
  ); // State for workroom data
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

  // Fetch workroom details (tasks)
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
          setRoomName(data?.name || ""); // Set room name, added nullish check
          setTasks(data?.tasks || []); //  set tasks, added nullish check
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    getWorkroomData();
  }, [workroomId]);

  // Step-based component rendering
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateRoom
            type="edit"
            setRoomName={setRoomName}
            roomName={roomName}
            stepsData={stepsData}
            setStepsData={setStepsData}
            onWorkroomCreated={setWorkroomId}
          />
        );
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
            tasks={tasks}
            setWorkroomData={setWorkroomData}
            stepsData={stepsData}
            setStepsData={setStepsData}
            workroomId={workroomId && workroomId}
          />
        );
      case 5:
        return (
          <Golive
            data={workroomData}
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
    return <CreateWorkroomLoader />; // Or use your LoadingPage component
  }

  if (error) {
    return <div>Error: {error}</div>; // Display the error to the user
  }

  return (
    <div className="p-[clamp(1.75rem,_1.0256vw,_2.5rem)] flex flex-col gap-[clamp(1.25rem,_1.0256vw,_2rem)]">
      <WorkroomHeader
        type={"edit"}
        current_step={currentStep}
        header_steps={steps}
        headerTitle={roomName}
      />

      <div className="flex flex-col neo-effect px-4 py-[clamp(1.375rem,_1.3675vw,_2.375rem)] items-center w-full h-fit mt-[clamp(1.25rem,_1.0256vw,_2rem)] gap-8">
        {renderStepComponent()}
        <WorkroomFooter
          type="edit"
          workroomId={workroomId}
          current_step={currentStep}
          set_current_step={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default CreateWorkroom;
