"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { backendUri } from "@/lib/config";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LoadingPage from "@/components/shared/loading-page";
import { Task } from "@/app/(tasks)/your-tasks/my-task";

interface RatingScaleProps {
  minLabel?: string;
  maxLabel?: string;
  initialValue?: number;
  numSegments?: number;
  onChange?: (value: number) => void;
}

const RatingScale: React.FC<RatingScaleProps> = ({
  minLabel = "Not Important",
  maxLabel = "Very Important",
  initialValue = 0,
  numSegments = 10,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleSelect = useCallback(
    (value: number) => {
      setSelectedValue(value);
      onChange?.(value);
    },
    [onChange]
  );

  const handleHover = useCallback((value: number | null) => {
    setHoverValue(value);
  }, []);

  const segments = Array.from({ length: numSegments }, (_, i) => i + 1);

  return (
    <div className="w-fit flex flex-col items-center gap-6">
      <div className="flex justify-between w-full text-sm text-gray-500">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div className="flex w-full justify-center">
        {segments.map((segment) => {
          const isSelected = selectedValue >= segment;
          const isHovered = hoverValue !== null && hoverValue >= segment;

          let bgColorClass = "bg-gray-200";
          if (isHovered) {
            bgColorClass = "bg-purple-400";
          } else if (isSelected) {
            bgColorClass = "bg-purple-500";
          }

          let textColorClass = "text-gray-700";
          if (isHovered || isSelected) {
            textColorClass = "text-white";
          }
          const numberCircleColor = isSelected
            ? "bg-purple-500"
            : "bg-purple-300";

          return (
            <div
              key={segment}
              className="flex flex-col items-center justify-start gap-2"
              style={{ marginRight: 0 }}
            >
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200",
                  numberCircleColor,
                  "text-white",
                  "mb-1",
                  "transition-transform transform",
                  isSelected ? "scale-125" : "scale-100",
                  isHovered ? "scale-125" : "scale-100"
                )}
                animate={{
                  scale: isSelected || isHovered ? 1.25 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {segment}
              </motion.div>
              <motion.div
                className={cn(
                  "w-[81px] h-[44px]  ring-1 ring-[#091e421f] rounded-full transition-colors duration-200",
                  bgColorClass,
                  textColorClass,
                  "cursor-pointer select-none",
                  "transition-all duration-300",
                  "ring-2 ring-transparent",
                  isSelected && "ring-purple-500",
                  isHovered && "ring-purple-500 shadow-lg"
                )}
                style={{ borderRadius: "12px" }}
                onClick={() => handleSelect(segment)}
                onMouseEnter={() => handleHover(segment)}
                onMouseLeave={() => handleHover(null)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${segment} out of ${numSegments}`}
                animate={{
                  scale: isSelected || isHovered ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isSelected || isHovered ? "" : ""}
              </motion.div>
            </div>
          );
        })}
      </div>
      {/* <div className="mt-4 text-sm text-gray-600">
        Selected Value: {selectedValue}
      </div> */}
    </div>
  );
};

interface CreateKpiProps {
  workroomId: string | null;
}

const formSchema = z.object({
  kpiName: z.string().min(1, {
    message: "KPI name is required.",
  }),
  rating: z.number().min(1, { message: "Rating must be greater than 0" }),
});
const fetchWorkroomDetails = async (
  workroomId: string | null,
  backendUri: string | undefined
) => {
  if (!workroomId) {
    console.warn("Workroom ID is null or undefined. Cannot fetch details.");
    return null; // Or throw an error, depending on your error handling policy
  }

  if (!backendUri) {
    const errorMessage =
      "Backend URI is not defined. Cannot fetch workroom details.";
    console.error(errorMessage);
    throw new Error(errorMessage); // Explicitly throw error to stop execution
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      const errorMessage = "No authentication token found.  Please log in.";
      console.error(errorMessage);
      throw new Error(errorMessage); //  Explicitly throw error
    }

    const response = await fetch(
      `${backendUri}/api/v1/workrooms/${workroomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response
      const errorMessage = `Failed to fetch workroom details. Status: ${response.status},  Body: ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage); // Include status and body in error
    }

    const data: WorkroomDetails = await response.json();
    return data; // Return the entire data object
    console.log(data);
  } catch (error) {
    //  IMPORTANT:  Don't just log.  RETHROW the error.
    console.error("Error fetching workroom details:", error);
    throw error; // Re-throw to allow caller to handle it.
  }
};

interface Member {
  id: string;
  created_at: string;
  updated_at: string;
  auth_provider: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role: string;
  xp: number;
  level: number;
  avatar_url: string;
  is_verified: boolean;
  is_user_onboarded: boolean;
  productivity: number;
  average_task_time: number;
  user_type: string;
  find_us: string;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  software_used: string[];
}

interface Metric {
  metric_name: string;
  metric_value: number;
}

interface WorkroomDetails {
  id: string;
  name: string;
  created_by: string;
  kpis: string;
  metrics: Metric[];
  tasks: Task[];
  performance_metrics: {
    kpi_name: string;
    metric_value: number;
    weight: number;
  }[];
  members: Member[];
}

const CreateKpi = ({ workroomId }: CreateKpiProps) => {
  const [kpiList, setKpiList] = useState<
    { kpi_name: string; metric_value: number; weight: number }[]
  >([]);
  const [filterType, setFilterType] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kpiName: "",
      rating: 0,
    },
  });

  const { handleSubmit, control, reset, formState } = form;

  const handleAddKpi = async (data: z.infer<typeof formSchema>) => {
    if (!workroomId) {
      setError("No room id is found");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const newKpi = {
        kpi_name: data.kpiName,
        metric_value: data.rating, // Use rating for both value and weight
        weight: data.rating,
      };
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            performance_metrics: [...kpiList, newKpi],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          `Failed to update KPIs: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
        return;
      }
      reset();

      const updatedData = await fetchWorkroomDetails(workroomId, backendUri);
      if (updatedData && updatedData.performance_metrics) {
        setKpiList(updatedData.performance_metrics); // Update KPI list
      }

      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred while updating KPIs.");
    } finally {
      setLoading(false);
    }
  };

  const filteredKpiList = useMemo(() => {
    let list = [...kpiList];
    switch (filterType) {
      case "value":
        list.sort((a, b) => b.metric_value - a.metric_value);
        break;
      case "alpha":
        list.sort((a, b) => a.kpi_name.localeCompare(b.kpi_name));
        break;
      case "recent":
      default:
        break;
    }
    return list;
  }, [kpiList, filterType]);

  if (loading) {
    return <LoadingPage loadingText="Updating KPIs..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="w-full max-h-[60vh] min-h-[400px] overflow-y-auto flex flex-col gap-10">
      <section className="h-2/5 w-full ">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleAddKpi)}
            className="w-full h-full flex flex-col gap-6 items-center "
          >
            <FormField
              control={control}
              name="kpiName"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center">
                  <FormLabel className="text-[clamp(0.9rem,_0.6838vw,_1rem)] font-normal">
                    What&apos;s the name of the Kpi you want to track
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    {" "}
                    {/* Added div for layout */}
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Enter your Kpi Name here"
                        className="h-[clamp(2.375rem,_1.8803vh,_3.75rem)] w-[400px] max-w-2/3"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      className="h-[clamp(2.375rem,_1.8803vh,_3.75rem)] ring-purple-500 text-white hover:ring-purple-600 disabled:bg-gray-400
                                                        transition-all duration-200 hover:scale-105 w-fit"
                      disabled={!formState.isValid}
                    >
                      Add
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="rating"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center">
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RatingScale
                      initialValue={3}
                      numSegments={10}
                      onChange={(value) => field.onChange(value)}
                      minLabel="Not Important"
                      maxLabel="Very Important"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>
      <section className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold ">KPI List</h3>
          <Select onValueChange={setFilterType} value={filterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="value">Value</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filteredKpiList.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="space-y-3">
              {filteredKpiList.map((kpi, index) => (
                <motion.li
                  key={index}
                  className="text-gray-700 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200
                                                border-l-4 border-purple-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="font-medium">{kpi.kpi_name}</span> :{" "}
                  <span className="text-purple-500 font-semibold">
                    {kpi.metric_value} (Weight: {kpi.weight})
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500 text-center">No KPIs added yet.</div>
        )}
      </section>
    </main>
  );
};

export default CreateKpi;
