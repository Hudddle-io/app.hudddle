import { useState, useEffect, useCallback } from "react";
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { format } from "date-fns";
import Image from "next/image";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Task } from "@/app/(tasks)/your-tasks/my-task";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import FilterCategory from "@/app/(tasks)/your-tasks/filter-category";
import fetchTasks from "@/lib/fetch-tasks";

const filter = "/assets/filter.png";
const CreateNewTask = () => {
  // state
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<
    { from?: Date | null; to?: Date | null } | undefined
  >();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);

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

  const handleTaskCreated = () => {
    fetchTasks({
      setLoadingTasks,
      setErrorTasks,
      setTasks,
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-[38px] flex flex-row space-x-2"
            size="lg"
          >
            <Image src={filter} alt="" width={18} height={18} />
            <h1 className="text-[#42526ECC] text-[14px] font-light">Filter</h1>
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
              <DialogClose asChild>
                <Button variant="outline" className="text-black rounded-[25px]">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="secondary"
                className="text-[#FFFFFF] rounded-[25px]"
                onClick={applyFilters}
              >
                Apply Filter
              </Button>
            </div>
          </DialogHeader>
          <div className="flex flex-col space-y-7">
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
                        selected={dateRange?.from || undefined}
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
                    open={dateRange?.to !== undefined && dateRange?.to !== null}
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
                        selected={dateRange?.to || undefined}
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
              variant="outline"
              className="text-[#FF5531] w-36 rounded-3xl"
            >
              Reset all filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNewTask;
