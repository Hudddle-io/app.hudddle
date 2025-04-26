import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    recurringTask: z.enum(["yes", "no"], {
        required_error: "Select if you want a recurring task.",
    }),
    taskName: z.string().min(2, {
        message: "Enter the name of your task"
    }),
    taskCategory: z.string().min(1, { message: "Select your task category" }),
    taskDuration: z.string().min(1, { message: "Select task duration" }),
    taskTools: z.string().transform(value => value.split(',').map(tool => tool.trim()).filter(tool => tool !== '')),
});

interface CreateTaskSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated: () => void;
}

const CreateTaskSheet: React.FC<CreateTaskSheetProps> = ({ isOpen, onClose, onTaskCreated }) => {
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const storedToken = localStorage.getItem('token');

        if (!storedToken) {
            console.error("No token found, cannot create task.");
            return;
        }

        try {
            const response = await fetch("https://hudddle-backend.onrender.com/api/v1/tasks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
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
                console.error("Task creation failed:", errorData);
                throw new Error(`Task creation failed: ${response.status} - ${errorData?.message || response.statusText}`);
            }

            form.reset();
            onClose();
            onTaskCreated();
        } catch (error: any) {
            console.error("Submission failed:", error.message);
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex flex-col space-y-4">
                <SheetHeader>
                    <SheetTitle className="text-[36px] font-medium leading-[120%] text-[#42526E]">Create Task</SheetTitle>
                    <SheetDescription>
                        Keep up with your everyday task and schedules. Fill out these forms accurately
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                        <div className="flex flex-row items-center space-x-2">
                            <FormField
                                control={form.control}
                                name="recurringTask"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#42526E] text-[15px]">Recurring Task?</FormLabel>
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
                                            <FormControl>
                                                <Input placeholder="Enter Task Name" {...field} />
                                            </FormControl>
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
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select duration" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="15min">1 hour</SelectItem>
                                                    <SelectItem value="30min">2 hour</SelectItem>
                                                    <SelectItem value="1h">6 hour</SelectItem>
                                                    <SelectItem value="2h">12 hours</SelectItem>
                                                    <SelectItem value="4h">A day</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                                </SelectContent>
                                            </Select>
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
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter tools, separated by commas"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Creating Task..." : "Add new Task"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default CreateTaskSheet;