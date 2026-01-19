"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Interface for the data points passed to the chart
interface KpiMetricHistoryEntry {
  kpi_name: string;
  date: string;
  alignment_percentage: number;
}

// Props for the WeeklyChart component
interface WeeklyChartProps {
  historyData: KpiMetricHistoryEntry[];
}

const chartConfig = {
  alignment_percentage: {
    label: "Alignment",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function WeeklyChart({ historyData = [] }: WeeklyChartProps) {
  const [chartData, setChartData] = useState<KpiMetricHistoryEntry[]>([]);

  useEffect(() => {
    // Process and sort data when the component receives new historyData
    if (historyData && historyData.length > 0) {
      const sortedData = [...historyData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setChartData(sortedData);
    } else {
      setChartData([]);
    }
  }, [historyData]);

  // Function to generate a formatted date range string for the chart description
  const getFormattedDateRange = () => {
    if (chartData.length === 0) {
      return "No data available";
    }
    const firstDate = new Date(chartData[0].date);
    const lastDate = new Date(chartData[chartData.length - 1].date);

    // Check if dates are valid before formatting
    if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
      return "Invalid date range";
    }

    return `${format(firstDate, "LLL dd, y")} - ${format(
      lastDate,
      "LLL dd, y"
    )}`;
  };

  return (
    <Card className="bg-transparent shadow-none ring-0 border-0 w-full">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base font-semibold">
              Weekly Alignment
            </CardTitle>
            <CardDescription>{getFormattedDateRange()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[160px] w-full"
          config={chartConfig}
        >
          {chartData.length > 0 ? (
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  try {
                    return format(new Date(value), "MMM d");
                  } catch (error) {
                    return "";
                  }
                }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="alignment_percentage"
                type="natural"
                fill="#956fd6"
                fillOpacity={0.2}
                stroke="#956fd6"
                strokeWidth={2}
                isAnimationActive
                animationDuration={700}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No alignment history available.
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
