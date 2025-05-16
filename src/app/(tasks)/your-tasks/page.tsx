"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  CalendarIcon,
  Loader,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import building from "../../../../public/assets/building.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import MyTask, { Task } from "./my-task";
import { format } from "date-fns";
import CreateNewTask from "@/components/shared/create-new-task";
import fetchTasks from "@/lib/fetch-tasks";
import CreateTaskSheet from "./create-task-sheet";
import LoadingPage from "@/components/shared/loading-page";

const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<
    { from?: Date | null; to?: Date | null } | undefined
  >();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM dd, yyyy");

  const stableSetTasks = useCallback(setTasks, []);

  const handleTaskCreated = () => {
    fetchTasks({
      setLoadingTasks,
      setErrorTasks,
      setTasks,
    });
  };

  useEffect(() => {
    fetchTasks({
      setLoadingTasks,
      setErrorTasks,
      setTasks,
    });
  }, []);

  useEffect(() => {
    if (allTasks.length === 0 && tasks.length > 0) {
      console.log("Synchronizing allTasks with tasks", tasks);
      setAllTasks(tasks); // Synchronize allTasks with the initial tasks
    }
  }, [tasks, allTasks]);

  const completedTasksCount = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const pendingTasksCount = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;
  const totalTasksCount = tasks.length;

  const applyFilters = useCallback(() => {
    let filteredTasks = [...allTasks];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        selectedStatuses.includes(task.status)
      );
    }

    // Filter by date range
    if (dateRange?.from) {
      filteredTasks = filteredTasks.filter(
        (task) => dateRange.from && new Date(task.deadline) >= dateRange.from
      );
    }
    if (dateRange?.to) {
      filteredTasks = filteredTasks.filter(
        (task) => dateRange.to && new Date(task.deadline) <= dateRange.to
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        selectedCategories.includes(task.category)
      );
    }

    setTasks(filteredTasks);
    setFilterDialogOpen(false);
  }, [allTasks, selectedStatuses, dateRange, selectedCategories]);

  const resetFilters = useCallback(() => {
    setSelectedStatuses([]);
    setDateRange(undefined);
    setSelectedCategories([]);
    setTasks([...allTasks]);
  }, [allTasks]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      console.log("Search term:", searchTerm);
      console.log("All tasks:", allTasks);

      const sourceTasks = allTasks.length > 0 ? allTasks : tasks; // Fallback to tasks if allTasks is empty
      const filteredTasks = sourceTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log("Filtered tasks:", filteredTasks);
      setTasks(filteredTasks);
    },
    [allTasks, tasks]
  );

  return (
    <div className="min-w-full flex px-8 flex-col">
      <div className="w-full my-10 items-center flex justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <ArrowLeft size={24} color="#956FD6" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-medium">Your tasks</h1>
            <div className="flex flex-row space-x-3">
              <h1 className="text-[#4D4D4D] text-[16px] font-normal">
                {formattedDate}
              </h1>
              <CalendarIcon size={24} color="#C4C4C4" />
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-3">
          <Button
            className="flex space-x-2 bg-[#956FD6]"
            onClick={() => setIsSheetOpen(true)}
          >
            <Plus size={24} color="white" />
            <h1>Create Task</h1>
          </Button>
          <Button variant="outline" className="flex space-x-2">
            <Image src={building} alt="" width={20} height={20} />
            <h1 className="flex items-center gap-1">
              <strong className="flex items-center gap-1">
                {completedTasksCount ? (
                  completedTasksCount
                ) : (
                  <Loader2 className="animate-spin h-2 w-2" />
                )}
                /
                {totalTasksCount ? (
                  totalTasksCount
                ) : (
                  <Loader2 className="animate-spin h-2 w-2" />
                )}{" "}
                tasks
              </strong>{" "}
              completed
            </h1>
          </Button>
          <Button variant="outline" className="flex space-x-2">
            <h1 className="text-[#956FD6]">
              {pendingTasksCount ? (
                pendingTasksCount
              ) : (
                <Loader2 className="animate-spin h-2 w-2" />
              )}{" "}
              Pending tasks
            </h1>
          </Button>
        </div>
      </div>

      <CreateTaskSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <div className="w-full max-h-screen rounded-[12px]">
        <div className="p-6 w-full flex flex-col gap-5">
          <div className="flex justify-between items-center space-x-3 flex-row">
            <div className="w-[1054px] bg-[#FDFCFC] rounded-[38px] relative flex items-center ">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={24}
              />
              <Input
                className="pl-10 h-[50px] rounded-[38px]"
                placeholder="Search"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <CreateNewTask />
          </div>

          <div>
            {loadingTasks ? (
              <LoadingPage loadingText="Loading your tasks ..." />
            ) : errorTasks ? (
              <div>Error loading tasks: {errorTasks}</div>
            ) : tasks.length > 0 ? (
              <MyTask
                setTasks={setTasks}
                setErrorTasks={setErrorTasks}
                setLoadingTasks={setLoadingTasks}
                tasks={tasks}
                totalItems={tasks.length}
              />
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
