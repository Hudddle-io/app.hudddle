"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react"; // Keep if used elsewhere, otherwise can remove
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription, // Can be removed if not used
  CardFooter, // Can be removed if not used
  CardHeader, // Can be removed if not used
  CardTitle, // Can be removed if not used
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MetricChartProps {
  kpiName: string;
  weight: number; // Weight is from 0 to 10
  percentage: number; // Added percentage prop
}

export function MetricChart({ kpiName, weight, percentage }: MetricChartProps) {
  // Define chart data based on the weight
  // The pie chart will show 'achieved' and 'remaining' portions
  // Using specific hex colors to match the provided image
  const chartData = [
    { name: "Achieved", value: percentage, fill: "#6B46C1" }, // Darker purple for achieved part
    { name: "Remaining", value: 100 - percentage, fill: "#A78BFA" }, // Lighter purple/blue for remaining part
  ];

  // Define chart configuration (colors here are less critical as fill is set directly in chartData)
  const chartConfig = {
    value: {
      label: "Value",
    },
    Achieved: {
      label: "Achieved",
      color: "#6B46C1",
    },
    Remaining: {
      label: "Remaining",
      color: "#A78BFA",
    },
  } satisfies ChartConfig;

  return (
    // Card styling updated to match the image's background and rounded corners
    <Card className="flex flex-col bg-transparent rounded-[16px] shadow-none border-none p-4">
      <CardContent className="flex-1 p-0 flex items-center justify-center">
        {" "}
        {/* Centering content */}
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[160px] w-[160px] mx-auto" // Adjusted size for the inner chart
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value" // Use 'value' as the data key
              nameKey="name" // Use 'name' for the segments
              innerRadius={60}
              outerRadius={80} // Increased outer radius slightly for thicker ring
              strokeWidth={0} // No stroke for a cleaner look
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 10} // Adjusted Y position for percentage
                          className="fill-[#211451] text-3xl font-bold" // Darker text for percentage, larger font
                        >
                          {percentage.toFixed(0)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15} // Adjusted Y position for KPI name
                          className="fill-[#999999] text-base" // Lighter gray text for KPI name, slightly larger
                        >
                          {/* {kpiName} */}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
