"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backendUri } from "@/lib/config";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  recurringTask: z.enum(["yes", "no"], {
    required_error: "Select if you want a recurring task.",
  }),
  taskName: z.string().min(2, {
    message: "Enter the name of your task",
  }),
  taskCategory: z.string().min(1, { message: "Select your task category" }),
  taskDuration: z.string().min(1, { message: "Select task duration" }),
  taskTools: z
    .union([
      z.string(),
      z.array(z.string()).transform((tools) => tools.join(",")),
    ])
    .transform((value) =>
      typeof value === "string"
        ? value
            .split(",")
            .map((tool) => tool.trim())
            .filter((tool) => tool !== "")
        : value
    ),
});

interface UpdateTaskSheetProps {
  isOpen: boolean;
  taskId?: string;
  onClose: () => void;
  onTaskCreated: () => void;
}

const UpdateTaskSheet: React.FC<UpdateTaskSheetProps> = ({
  taskId,
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recurringTask: "no",
      taskName: "",
      taskCategory: "",
      taskDuration: "",
      taskTools: [],
    },
  });

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (!taskId) return;

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        console.error("No token found, cannot fetch task details.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${backendUri}/api/v1/tasks/${taskId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch task details", response.status);
          return;
        }

        const taskData = await response.json();
        form.reset({
          recurringTask: taskData.is_recurring ? "yes" : "no",
          taskName: taskData.title || "",
          taskCategory: taskData.category || "",
          taskDuration: taskData.duration || "",
          taskTools: taskData.task_tools || [],
        });
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTaskDetails();
    }
  }, [isOpen, taskId, form]);

  const handleDeleteTask = async () => {
    if (!taskId) return;
    setIsDeleting(true);

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.error("No token found, cannot delete task.");
      return;
    }

    try {
      const response = await fetch(`${backendUri}/api/v1/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete task", response.status);
        return;
      }
      setIsDeleting(false);
      onClose();
      onTaskCreated();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found, cannot update task.");
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
          is_recurring: values.recurringTask === "yes",
          title: values.taskName,
          category: values.taskCategory,
          duration: values.taskDuration,
          task_tools: values.taskTools,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Task update failed:", errorData);
        throw new Error(
          `Task update failed: ${response.status} - ${
            errorData?.message || response.statusText
          }`
        );
      }

      form.reset();
      onClose();
      onTaskCreated();
    } catch (error: any) {
      console.error("Submission failed:", error.message);
    }
    onTaskCreated();
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col space-y-4">
        <SheetHeader>
          <SheetTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">
            <Pencil size={18} color="#707070" />
            <span>Edit Your Task</span>
          </SheetTitle>
          <SheetDescription>
            Keep up with your everyday task and schedules. Fill out these forms
            accurately
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-row items-center space-x-2">
              <FormField
                control={form.control}
                name="recurringTask"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#42526E] text-[15px]">
                      Recurring Task?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="Enter Task Name" {...field} />
                        </FormControl>
                        {isLoading && <Loader2 className="animate-spin" />}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="taskDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Duration</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15min">1 hour</SelectItem>
                              <SelectItem value="30min">2 hour</SelectItem>
                              <SelectItem value="1h">6 hour</SelectItem>
                              <SelectItem value="2h">12 hours</SelectItem>
                              <SelectItem value="4h">A day</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {isLoading && <Loader2 className="animate-spin" />}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Category</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urgent">Urgent</SelectItem>
                              <SelectItem value="important">
                                Important
                              </SelectItem>
                              <SelectItem value="routine">Routine</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {isLoading && <Loader2 className="animate-spin" />}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskTools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Tools</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder="Enter tools, separated by commas"
                            {...field}
                          />
                        </FormControl>
                        {isLoading && <Loader2 className="animate-spin" />}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <SheetFooter className="w-full flex items-center justify-between">
              <Dialog>
                <DialogTrigger className="text-red-500 border border-red-500 px-4 py-2 rounded-md">
                  Delete
                </DialogTrigger>
                <DialogContent className="w-full ">
                  <DialogHeader>
                    <DialogTitle>
                      Are you sure you want to remove this task ?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your task and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose className="text-black">
                      No, Don&apos;t Delete
                    </DialogClose>
                    <Button
                      id="confirm-delete"
                      className="bg-red-500 text-white hover:bg-transparent hover:text-red-500 hover:border-red-500 hover:border "
                      onClick={handleDeleteTask}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="flex items-center gap-2">
                          <p>Deleting..</p> <Loader2 className="animate-spin" />
                        </span>
                      ) : (
                        "Yes, Delete"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Updating Task..."
                  : "Update Task"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateTaskSheet;
