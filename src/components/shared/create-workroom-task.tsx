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
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Assuming backendUri is defined elsewhere, e.g., in a config file
import { backendUri } from "@/lib/config";
import { useEffect, useState } from "react";
// Assuming toast is defined elsewhere, e.g., in a toast utility
// import { toast } from "@/components/ui/use-toast";
import axios from "axios"; // axios is imported but not used, sticking to fetch for consistency
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Placeholder for backendUri and toast, as they are external imports
const toast = ({
  title,
  description,
  variant,
}: {
  title?: string;
  description: string;
  variant?: string;
}) => {
  console.log("Toast:", { title, description, variant });
  // In a real application, this would trigger a visual toast notification.
  // For this example, we'll just log it.
};

// Define the Zod schema for form validation
const formSchema = z.object({
  recurringTask: z.enum(["yes", "no"], {
    required_error: "Select if you want a recurring task.",
  }),
  taskName: z.string().min(2, {
    message: "Enter the name of your task",
  }),
  // taskCategory and taskDuration are required strings
  taskCategory: z.string().min(1, { message: "Select your task category" }),
  taskDuration: z.string().min(1, { message: "Select task duration" }),
  taskTools: z.string().transform(
    (value) =>
      // Transforms comma-separated string into an array of trimmed strings.
      // An empty input string will result in an empty array [].
      value
        .split(",")
        .map((tool) => tool.trim())
        .filter((tool) => tool !== "") // Filter out any empty strings resulting from split
  ),
  assigned_user_ids: z.array(z.string()).optional(), // Optional, so it can be an empty array
  due_by: z.string().optional(), // Optional, so it can be an empty string
});

// Define props interface for the component
interface CreateWorkroomTaskSheetProps {
  isOpen: boolean;
  workroomId?: string;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateWorkroomTaskSheet: React.FC<CreateWorkroomTaskSheetProps> = ({
  isOpen,
  workroomId,
  onClose,
  onTaskCreated,
}) => {
  // State to store workroom details, used to populate assigned members
  const [workroomDetails, setWorkroomDetails] = useState<any>(null);
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // taskTitle and taskDueBy states are not directly used in the form, can be removed if not needed elsewhere
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueBy, setTaskDueBy] = useState("");
  // State for workroom tasks (not directly used in this component)
  const [workroomTasks, setWorkroomTasks] = useState<any[]>([]);

  // Initialize react-hook-form with Zod resolver and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recurringTask: "no",
      taskName: "default task name", // Default task name
      taskCategory: "", // Default empty string for Select (required by schema)
      taskDuration: "", // Default empty string for Select (required by schema)
      taskTools: [], // Default empty array for Input, will be transformed by Zod
      due_by: "", // Default empty string for date
      assigned_user_ids: [], // Default empty array for assigned users
    },
  });

  // Effect hook to fetch workroom details when workroomId changes
  useEffect(() => {
    const fetchWorkroomDetails = async () => {
      if (!workroomId) {
        console.warn("No workroomId provided, cannot fetch workroom details.");
        return;
      }

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        console.error("No token found, cannot fetch workroom details.");
        return;
      }

      try {
        setLoading(true); // Set loading state
        const response = await fetch(
          `${backendUri}/api/v1/workrooms/${workroomId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch workroom details:", errorData);
          toast({
            title: "Error",
            description: `Failed to load workroom details: ${
              errorData?.message || response.statusText
            }`,
            variant: "destructive",
          });
          return;
        }

        const data = await response.json();
        setWorkroomDetails(data);
      } catch (error: any) {
        console.error("Error fetching workroom details:", error);
        toast({
          title: "Error",
          description: `An unexpected error occurred: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchWorkroomDetails();
  }, [workroomId]); // Dependency array ensures effect runs when workroomId changes

  // Function to handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token found, cannot create task.");
      toast({
        title: "Authentication Error",
        description: "Please log in to create a task.",
        variant: "destructive",
      });
      return;
    }

    // Log the form values *before* sending to the backend for debugging
    console.log("Form values captured by react-hook-form:", values);

    try {
      setLoading(true); // Set loading state for submission

      // Construct the payload based on backend expectations
      const payload = {
        is_recurring: values.recurringTask === "yes",
        title: values.taskName,
        // These should be non-empty strings due to Zod's .min(1) validation.
        // If backend still receives null, verify backend field names or data type handling.
        category: values.taskCategory,
        duration: values.taskDuration,
        // task_tools is already an array due to Zod transform.
        // Send null if the array is empty, as your backend seems to convert [] to null.
        task_tools: values.taskTools.length > 0 ? values.taskTools : null,
        // Send due_by as null if no date is picked (empty string), otherwise the ISO string
        due_by: values.due_by || null,
        // assigned_user_ids is an array. Send null if the array is empty, as your backend seems to convert [] to null.
        assigned_user_ids:
          values.assigned_user_ids && values.assigned_user_ids.length > 0
            ? values.assigned_user_ids
            : null,
      };

      // Log the final payload being sent to the backend for debugging
      console.log(
        "Payload being sent to backend:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Task creation failed:", errorData);
        throw new Error(
          `Task creation failed: ${response.status} - ${
            errorData?.message || response.statusText
          }`
        );
      }

      // Log the response data (optional, for debugging)
      const responseData = await response.json();
      console.log("Task created successfully, backend response:", responseData);

      toast({
        description: "Task created successfully!",
      });
      form.reset(); // Reset form fields to default values
      onClose(); // Close the sheet
      onTaskCreated(); // Trigger parent's callback for task creation
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message,
        variant: "destructive",
      });
      console.error("Submission failed:", error.message);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col space-y-4 overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">
            Create Task in This Workroom
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
            {/* Recurring Task Radio Group */}
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
              {/* Task Name Input */}
              <div className="flex flex-col gap-1">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Task Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Task Duration Select */}
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="taskDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Duration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // Directly use field.value as it's a string now
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15min">15 minutes</SelectItem>
                          <SelectItem value="30min">30 minutes</SelectItem>
                          <SelectItem value="1h">1 hour</SelectItem>
                          <SelectItem value="2h">2 hours</SelectItem>
                          <SelectItem value="4h">4 hours</SelectItem>
                          <SelectItem value="8h">8 hours (A day)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Category Select */}
                <FormField
                  control={form.control}
                  name="taskCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // Directly use field.value as it's a string now
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="important">Important</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Task Tools Input */}
                <FormField
                  control={form.control}
                  name="taskTools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Tools</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tools, separated by commas"
                          {...field}
                          // Display the array as a comma-separated string for editing
                          value={
                            Array.isArray(field.value)
                              ? field.value.join(", ")
                              : field.value || ""
                          }
                          onChange={(e) => {
                            // Update the field value with the raw string from input
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Assign to Members Select (conditionally rendered if workroomDetails exist) */}
            {workroomDetails &&
              workroomDetails.members &&
              workroomDetails.members.length > 0 && (
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="assigned_user_ids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign to Members</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            // For this example, it's a single select that updates an array
                            field.onChange(value ? [value] : [])
                          }
                          // Display the first selected value or an empty string
                          value={
                            Array.isArray(field.value) && field.value.length > 0
                              ? field.value[0]
                              : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select members" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workroomDetails.members.map((member: any) => (
                              <SelectItem key={member.name} value={member.name}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

            {/* Due By Date Picker */}
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="due_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due By</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {field.value
                              ? format(new Date(field.value), "PPP")
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              // Convert selected date to ISO string for storage
                              const isoDate = new Date(date).toISOString();
                              field.onChange(isoDate);
                            } else {
                              field.onChange(""); // Set to empty string if date is cleared
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <SheetFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loading}
              >
                {form.formState.isSubmitting || loading
                  ? "Creating Task..."
                  : "Add new Task"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateWorkroomTaskSheet;
