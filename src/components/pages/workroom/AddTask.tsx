import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import { CalendarIcon, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import FilterCategory from "@/app/(tasks)/your-tasks/filter-category";
import { cn } from "@/lib/utils";
import filter from "../../../../public/assets/filter.png";
import { backendUri } from "@/lib/config";

interface Props {
  stepsData: any;
  setStepsData: React.Dispatch<any>;
  workroomId: string;
}

const applyFilters = () => {
  // Placeholder function for applying filters
  console.log("Filters applied");
};

const AddTask = ({ stepsData, setStepsData, workroomId }: Props) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            description: "Authorization token not found. Please log in.",
            variant: "destructive",
          });
          return;
        }

        const response = await axios.get(
          `${backendUri}/api/v1/workrooms/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTasks(response.data);
        console.log(tasks);
      } catch (error) {
        toast({
          description: "Failed to fetch tasks. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (workroomId) {
      fetchTasks();
    }
  }, [workroomId, tasks]);

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          description: "Authorization token not found. Please log in.",
          variant: "destructive",
        });
        return;
      }

      const taskData = {
        title: taskTitle,
        description: taskDescription,
        status: "PENDING",
        due_date: new Date().toISOString(),
      };

      await axios.post(
        `https://hudddle-backend.onrender.com/api/v1/workrooms/${workroomId}/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        description: "Task created successfully!",
      });

      // Fetch tasks again to update the list
      const response = await axios.get(
        `https://hudddle-backend.onrender.com/api/v1/workrooms/${workroomId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data);
      setTaskTitle("");
      setTaskDescription("");
    } catch (error) {
      toast({
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full px-16">
      <header className="w-full flex justify-between items-center">
        <h1 className="text-[clamp(0.875rem,_0.5983vw,_1.3125rem)] leading-[22px] text-[#956FD6] font-semibold">
          Your Task
        </h1>
        <div className="flex gap-2 items-center">
          <Input type="search" placeholder="search..." />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-[38px] flex flex-row space-x-2"
                size="lg"
              >
                <Image src={filter} alt="" width={18} height={18} />
                <h1 className="text-[#42526ECC] text-[14px] font-light">
                  Filter
                </h1>
              </Button>
            </DialogTrigger>
            <DialogContent className="py-12 px-10 max-w-3xl rounded-xl">
              <DialogHeader className="flex items-center flex-row justify-between">
                <DialogTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">
                  Filter
                </DialogTitle>
                <DialogDescription>
                  Select the criteria to filter the displayed tasks.
                </DialogDescription>
                <div className="flex flex-row space-x-2">
                  <DialogPrimitive.Close asChild>
                    <Button
                      variant="outline"
                      className="text-black rounded-[25px]"
                    >
                      Cancel
                    </Button>
                  </DialogPrimitive.Close>
                </div>
              </DialogHeader>
              <div className="flex flex-col space-y-7">
                <Input
                  type="text"
                  placeholder="Task Title"
                  className="h-9 w-[clamp(12.5rem,_15.6239vw,_21rem)]"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Task Description"
                  className="h-9 w-[clamp(12.5rem,_15.6239vw,_21rem)]"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <h1 className="text-[16px] leading-[100%] font-medium">
                  Filter by status
                </h1>
                <div className="flex flex-row space-x-3 items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pending"
                      checked={selectedStatuses.includes("PENDING")}
                      onCheckedChange={(checked) =>
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, "PENDING"]
                            : prev.filter((s) => s !== "PENDING")
                        )
                      }
                    />
                    <Label htmlFor="pending">Pending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="completed"
                      checked={selectedStatuses.includes("COMPLETED")}
                      onCheckedChange={(checked) =>
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, "COMPLETED"]
                            : prev.filter((s) => s !== "COMPLETED")
                        )
                      }
                    />
                    <Label htmlFor="completed">Completed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="overdue"
                      checked={selectedStatuses.includes("OVERDUE")}
                      onCheckedChange={(checked) =>
                        setSelectedStatuses((prev) =>
                          checked
                            ? [...prev, "OVERDUE"]
                            : prev.filter((s) => s !== "OVERDUE")
                        )
                      }
                    />
                    <Label htmlFor="overdue">Overdue</Label>
                  </div>
                </div>

                <h1 className="font-medium text-[16px] pt-8 leading-[100%] text-[#42526E]">
                  Filter by Duration
                </h1>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row space-x-2 justify-between items-center">
                    <div className="flex flex-col w-full gap-1">
                      <Label>From</Label>
                      <Popover
                        open={dateRange?.from !== undefined}
                        onOpenChange={(open) =>
                          !open &&
                          setDateRange((prev) => ({
                            ...prev,
                            from: undefined,
                          }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !dateRange?.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              format(dateRange.from, "PPP")
                            ) : (
                              <span>Expected start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange?.from}
                            onSelect={(date) =>
                              setDateRange((prev) => ({
                                ...prev,
                                from: date,
                              }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <Label>To</Label>
                      <Popover
                        open={dateRange?.to !== undefined}
                        onOpenChange={(open) =>
                          !open &&
                          setDateRange((prev) => ({ ...prev, to: undefined }))
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !dateRange?.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.to ? (
                              format(dateRange.to, "PPP")
                            ) : (
                              <span>Expected end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange?.to}
                            onSelect={(date) =>
                              setDateRange((prev) => ({ ...prev, to: date }))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <h1>Filter by category</h1>
                  <FilterCategory
                    onCategoryChange={(categories) =>
                      setSelectedCategories(categories)
                    }
                    selectedCategories={selectedCategories}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="text-[#FFFFFF] rounded-[25px]"
                  onClick={handleAddTask}
                >
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <div className="flex flex-col w-full gap-[clamp(2.1875rem,_2.0166rem+0.8547vw,_2.8125rem)]">
        {tasks.map((task) => (
          <Task key={task.id}>
            <TaskDescription>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskDueTime>{task.due_date}</TaskDueTime>
            </TaskDescription>
            <TaskActions>
              <span className="text-[#EEAE05] text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] flex items-center">
                +<Zap width={12} height={12} />
                {task.task_point || 0}
              </span>
            </TaskActions>
          </Task>
        ))}
      </div>
      <footer className="w-full flex flex-col gap-1 ">
        <Link
          className="underline self-end text-[#999999] font-normal text-[14px] leading-[20px]"
          href={"/tasks"}
        >
          See all
        </Link>
      </footer>
    </div>
  );
};

export default AddTask;
