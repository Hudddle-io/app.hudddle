"use client";
import building from "../../../../public/assets/building.png";
import React, { useState, useEffect } from "react";
import ball from "../../../../public/assets/ball.png";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Clock, Pencil, Zap } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import UpdateTaskSheet from "./update-task-sheet";
import { backendUri } from "@/lib/config";
import { useRouter } from "next/navigation";
import fetchTasks from "@/lib/fetch-tasks";

const ITEMS_PER_PAGE = 3;

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  duration: string;
  is_recurring: boolean;
  status: string;
  category: string;
  task_tools: string[];
  deadline: string;
  due_by: string;
  task_point: number;
  completed_at: string | null;
  created_by_id: string;
  workroom_id: string;
}

interface MyTaskProps {
  tasks: Task[];
  totalItems: number;
  setLoadingTasks: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorTasks: React.Dispatch<React.SetStateAction<string | null>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const MyTask: React.FC<MyTaskProps> = ({
  tasks: initialTasks,
  totalItems: initialTotalItems,
  setLoadingTasks,
  setErrorTasks,
  setTasks,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [newTasks, setNewTasks] = useState<Task[]>(
    initialTasks.slice(0, ITEMS_PER_PAGE)
  );
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const router = useRouter();

  const handleTaskCreated = () => {
    // Logic to refresh tasks after a task is created
    router.refresh(); // Ensure the UI refreshes after task creation
  };

  const handleTaskUpdated = () => {
    fetchTasks({
      setLoadingTasks,
      setErrorTasks,
      setTasks,
    });

    router.refresh(); // Ensure the UI refreshes after task update
  };

  const openUpdateSheet = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsSheetOpen(true);
  };

  const handleMarkAsCompleted = async (taskId: string) => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found, cannot update task status.");
      return;
    }

    try {
      const response = await fetch(`${backendUri}/api/v1/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          status: "COMPLETED",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update task status:", errorData);
        return;
      }
      fetchTasks({
        setLoadingTasks,
        setErrorTasks,
        setTasks,
      });

      router.refresh(); // Refresh the page to reflect the updated status
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (typeof setTasks === "function") {
      const slicedTasks = initialTasks.slice(startIndex, endIndex);
      setTasks((prevTasks) => {
        // Only update if the tasks have changed
        if (JSON.stringify(prevTasks) !== JSON.stringify(slicedTasks)) {
          return slicedTasks;
        }
        return prevTasks;
      });
    } else {
      console.error("setTasks is not a function");
    }
  }, [currentPage, initialTasks, setTasks]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= Math.ceil(totalItems / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
    }
  };

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return initialTasks && initialTasks.length > 0 ? (
    <>
      <div className="flex flex-col gap-8">
        {newTasks &&
          Array.isArray(newTasks) &&
          newTasks.map((task) => (
            <div
              key={task.id}
              className="p-[clamp(0.875rem,_0.5128vw,_1.25rem)] rounded-[8px] task-morph w-full h-[clamp(6.25rem,_5.9765rem+1.3675vw,_7.25rem)]"
            >
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-center flex-row">
                  <div className="flex flex-row items-center space-x-12">
                    <h1 className="text-[clamp(1rem,_1.0737rem+0.2564vw,_1.3125rem)] capitalize font-bold text-[#4D4D4D]">
                      {task.title}
                    </h1>
                    <p className="text-[#999999] text-[clamp(0.8125rem,_0.7612rem+0.2564vw,_1rem)]">
                      <span className="font-bold">Deadline:</span>{" "}
                      <span className="">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </p>
                    <div className="flex items-center flex-row space-x-2">
                      <Image
                        src={building}
                        alt=""
                        width={20}
                        height={20}
                        style={{ width: "auto", height: "auto" }}
                      />
                      <p className="text-[#999999] text-[clamp(0.8125rem,_0.7612rem+0.2564vw,_1rem)]">
                        {task.workroom_id ? "In Workroom" : "Not in workroom"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Checkbox
                      id="mark-as-completed"
                      onCheckedChange={() => handleMarkAsCompleted(task.id)}
                    />
                    <span className="text-[#999999] text-[clamp(0.75rem,_0.7158rem+0.1709vw,_0.875rem)]">
                      Mark as Completed
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center flex-row">
                  <div className="flex items-center gap-10">
                    <div
                      id="due-date"
                      className="flex flex-row items-center space-x-1"
                    >
                      <Clock
                        className="text-[clamp(1rem,_0.9316rem+0.3419vw,_1.25rem)]"
                        color="#956FD699"
                      />{" "}
                      <p className="text-[clamp(0.75rem,_0.7158rem+0.1709vw,_0.875rem)] text-[#999999]">
                        Due by{" "}
                        {new Date(task.due_by).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div
                      id="tools"
                      className="flex items-center flex-row space-x-2"
                    >
                      <h1 className="text-[#999999] text-[14px] font-bold">
                        Tools
                      </h1>
                      {task.task_tools.map((tool, index) => (
                        <span key={index}>{tool}</span>
                      ))}
                      {task.task_tools.length > 0 && (
                        <Image
                          src={ball}
                          width={19}
                          height={13}
                          alt=""
                          style={{ width: "auto", height: "auto" }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={"ghost"}
                      className="hover:bg-transparent"
                      onClick={() => openUpdateSheet(task.id)}
                    >
                      <Pencil size={18} color="#707070" />
                    </Button>
                    <span
                      className={cn(
                        "px-2 py-[3px] flex items-center justify-center border border-slate-300 rounded-full text-[clamp(0.8125rem,_0.7612rem+0.2564vw,_1rem)]",
                        task.status === "PENDING" && "bg-[#FFADF8]",
                        task.status === "COMPLETED" && "bg-green-200",
                        task.status === "Not Completed" && "bg-red-200"
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {newTasks && Array.isArray(newTasks) && newTasks.length === 0 && (
          <p>No tasks available on this page.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <UpdateTaskSheet
        taskId={selectedTaskId ?? undefined}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTaskCreated={handleTaskUpdated}
      />
    </>
  ) : (
    <div>No tasks available.</div>
  );
};

export default MyTask;
