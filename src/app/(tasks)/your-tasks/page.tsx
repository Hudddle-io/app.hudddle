"use client";
import { useState, useEffect, useCallback } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CalendarIcon, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import building from "../../../../public/assets/building.png";
import filter from "../../../../public/assets/filter.png";
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import MyTask, { Task } from './my-task';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import FilterCategory from "./filter-category";
import CreateTaskSheet from "./create-task-sheet";

const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMMM dd, yyyy");

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const fetchTasks = async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      console.log("No token found in localStorage, cannot fetch tasks.");
      setLoadingTasks(false);
      return;
    }

    setLoadingTasks(true);
    setErrorTasks(null);

    try {
      const response = await fetch(
        `https://hudddle-backend.onrender.com/api/v1/tasks?page=1&page_size=1000`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorData?.message || response.statusText}`);
      }

      const data: Task[] = await response.json();
      console.log(`Task Data: ${JSON.stringify(data, null, 2)}`);
      setTasks(data);
    } catch (err: any) {
      setErrorTasks(err.message);
      console.error("Error fetching tasks:", err);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedTasksCount = tasks.filter(task => task.status === "COMPLETED").length;
  const pendingTasksCount = tasks.filter(task => task.status === "PENDING").length;
  const totalTasksCount = tasks.length;

  const applyFilters = useCallback(() => {
    let filteredTasks = [...allTasks];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filteredTasks = filteredTasks.filter(task => selectedStatuses.includes(task.status));
    }

    // Filter by date range
    if (dateRange?.from) {
      filteredTasks = filteredTasks.filter(task => new Date(task.deadline) >= dateRange.from);
    }
    if (dateRange?.to) {
      filteredTasks = filteredTasks.filter(task => new Date(task.deadline) <= dateRange.to);
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filteredTasks = filteredTasks.filter(task => selectedCategories.includes(task.category));
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

  return (
    <div className='min-w-full flex px-8 flex-col'>
      <div className="w-full my-10 items-center flex justify-between">
        <div className='flex items-center space-x-3'>
          <div>
            <ArrowLeft size={24} color="#956FD6"/>
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='font-medium'>Your tasks</h1>
            <div className='flex flex-row space-x-3'>
              <h1 className='text-[#4D4D4D] text-[16px] font-normal'>{formattedDate}</h1>
              <CalendarIcon size={24} color="#C4C4C4"/>
            </div>
          </div>
        </div>
        <div className='flex flex-row space-x-3'>
          <Button className='flex space-x-2 bg-[#956FD6]' onClick={() => setIsSheetOpen(true)}>
            <Plus size={24} color="white"/>
            <h1>Create Task</h1>
          </Button>
          <Button variant="outline" className='flex space-x-2'>
            <Image src={building} alt="" width={20} height={20}/>
            <h1><strong>{completedTasksCount}/{totalTasksCount} tasks</strong> completed</h1>
          </Button>
          <Button variant="outline" className='flex space-x-2'>
            <h1 className="text-[#956FD6]">{pendingTasksCount} Pending tasks</h1>
          </Button>
        </div>
      </div>
      
      <CreateTaskSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <div className='w-full max-h-screen bg-[#CACACA33] border shadow-[28px] border-slate-200 rounded-[12px]'>
        <div className='p-6 w-full flex flex-col gap-5'>
          <div className='flex justify-between items-center space-x-3 flex-row'>
            <div className='w-[1054px] bg-[#FDFCFC] rounded-[38px] relative flex items-center '>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={24}/>
              <Input className='pl-10 h-[50px] rounded-[38px]' placeholder='Search'/>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-[38px] flex flex-row space-x-2" size="lg">
                  <Image src={filter} alt="" width={18} height={18}/>
                  <h1 className="text-[#42526ECC] text-[14px] font-light">Filter</h1>
                </Button>
              </DialogTrigger>
              <DialogContent className="py-12 px-10 max-w-3xl rounded-xl">
                <DialogHeader className="flex items-center flex-row justify-between">
                  <DialogTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">Filter</DialogTitle>
                  <DialogDescription>
                    Select the criteria to filter the displayed tasks.
                  </DialogDescription>
                  <div className="flex flex-row space-x-2">
                    <DialogPrimitive.Close asChild>
                      <Button variant="outline" className="text-black rounded-[25px]">Cancel</Button> 
                    </DialogPrimitive.Close>
                    <Button variant="secondary" className="text-[#FFFFFF] rounded-[25px]" onClick={applyFilters}>Apply Filter</Button>
                  </div>
                </DialogHeader>
                <div className="flex flex-col space-y-7">
                  <h1 className="text-[16px] leading-[100%] font-medium">Filter by status</h1> 
                  <div className="flex flex-row space-x-3 items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pending" checked={selectedStatuses.includes("PENDING")} onCheckedChange={(checked) => setSelectedStatuses(prev => checked ? [...prev, "PENDING"] : prev.filter(s => s !== "PENDING"))} />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="completed" checked={selectedStatuses.includes("COMPLETED")} onCheckedChange={(checked) => setSelectedStatuses(prev => checked ? [...prev, "COMPLETED"] : prev.filter(s => s !== "COMPLETED"))} />
                      <Label htmlFor="completed">Completed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="overdue" checked={selectedStatuses.includes("OVERDUE")} onCheckedChange={(checked) => setSelectedStatuses(prev => checked ? [...prev, "OVERDUE"] : prev.filter(s => s !== "OVERDUE"))} />
                      <Label htmlFor="overdue">Overdue</Label>
                    </div>
                  </div>
                  
                  <h1 className="font-medium text-[16px] pt-8 leading-[100%] text-[#42526E]">Filter by Duration</h1>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row space-x-2 justify-between items-center">
                      <div className="flex flex-col w-full gap-1">
                        <Label>From</Label>
                        <Popover open={dateRange?.from !== undefined} onOpenChange={(open) => !open && setDateRange(prev => ({ ...prev, from: undefined }))}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !dateRange?.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange?.from ? format(dateRange.from, "PPP") : <span>Expected start date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange?.from}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex w-full flex-col gap-1">
                        <Label>To</Label>
                        <Popover open={dateRange?.to !== undefined} onOpenChange={(open) => !open && setDateRange(prev => ({ ...prev, to: undefined }))}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !dateRange?.to && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange?.to ? format(dateRange.to, "PPP") : <span>Expected end date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange?.to}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <h1>Filter by category</h1>
                    <FilterCategory onCategoryChange={(categories) => setSelectedCategories(categories)} selectedCategories={selectedCategories} />
                  </div>
                  <Button variant="outline" className="text-[#FF5531] w-36 rounded-3xl">
                    Reset all filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div>
            {loadingTasks ? (
              <div>Loading tasks...</div>
            ) : errorTasks ? (
              <div>Error loading tasks: {errorTasks}</div>
            ) : tasks.length > 0 ? (
              <MyTask tasks={tasks} totalItems={tasks.length} />
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