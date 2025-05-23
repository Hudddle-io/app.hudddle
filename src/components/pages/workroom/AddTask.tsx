"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateWorkroomTaskSheet from "@/components/shared/create-workroom-task";
import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import fetchWorkroomDetails, { WorkroomDetails } from "@/lib/fetch-workroom"; // Import
import { backendUri } from "@/lib/config";
import LoadingPage from "@/components/shared/loading-page";
interface Props {
  stepsData: any;
  setStepsData: React.Dispatch<any>;
  tasks: any[];
  workroomId: string | null;
  setWorkroomData: React.Dispatch<React.SetStateAction<WorkroomDetails | null>>;
}

const AddTask = ({
  stepsData,
  setStepsData,
  tasks,
  setWorkroomData,
  workroomId,
}: Props) => {
  const router = useRouter();

  const [workroomTasks, setWorkroomTasks] = useState<any[]>(tasks);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTaskToWorkroom = async () => {
    if (workroomId && backendUri) {
      setLoading(true);
      setError(null);
      try {
        const data: WorkroomDetails | null = await fetchWorkroomDetails(
          workroomId,
          backendUri
        );
        if (data) {
          setWorkroomData(data);
          setWorkroomTasks(data.tasks || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      router.refresh();
    }
  };

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
          if (data) {
            setWorkroomTasks(data.tasks || []);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    getWorkroomData();
  }, [workroomId]);

  if (loading) {
    return <LoadingPage loadingText="Fetching Workroom Tasks .." />; // Or use your LoadingPage component
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full px-16">
      <header className="w-full flex justify-between items-center">
        <h1 className="text-[clamp(0.875rem,_0.5983vw,_1.3125rem)] leading-[22px] text-[#956FD6] font-semibold">
          Your Task
        </h1>
        <div className="flex gap-2 items-center">
          <Button
            className="flex space-x-2 bg-[#956FD6]"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus size={24} color="white" />
            <h1>Create Task</h1>
          </Button>
          <CreateWorkroomTaskSheet
            isOpen={isSheetOpen}
            workroomId={workroomId || undefined}
            onClose={() => setIsSheetOpen(false)}
            onTaskCreated={handleAddTaskToWorkroom}
          />
        </div>
      </header>
      <div className="flex flex-col w-full gap-[clamp(2.1875rem,_2.0166rem+0.8547vw,_2.8125rem)]">
        {workroomTasks.length > 0 ? (
          workroomTasks.map((task: any) => (
            <Task key={task.id}>
              <TaskDescription>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDueTime>{task.due_by}</TaskDueTime>
              </TaskDescription>
              <TaskActions>
                <span className="text-[#EEAE05] text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] flex items-center">
                  +<Zap width={12} height={12} />
                  {task.task_point || 0}
                </span>
              </TaskActions>
            </Task>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs">
            You have no tasks in this room.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTask;
