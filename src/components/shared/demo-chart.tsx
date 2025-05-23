"use client";

import React, { useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartData {
  month: string;
  desktop: number;
}

const initialChartData: ChartData[] = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function WeeklyChart() {
  const [date, setDate] = useState<
    { from: Date | undefined; to?: Date | undefined } | undefined
  >({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of the year
    to: new Date(), // Today
  });
  const [chartData, setChartData] = useState<ChartData[]>(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return initialChartData.filter((item) => {
      const itemDate = new Date(
        today.getFullYear(),
        monthNames.indexOf(item.month),
        1
      );
      return itemDate >= startOfYear && itemDate <= today;
    });
  });

  const handleDateChange = useCallback(
    (
      selectedDate:
        | { from: Date | undefined; to?: Date | undefined }
        | undefined
    ) => {
      setDate(selectedDate);

      if (selectedDate?.from) {
        const fromDate = selectedDate.from;
        const toDate = selectedDate.to || new Date(); // If 'to' is undefined, use today.

        const filteredData = initialChartData.filter((item) => {
          const itemDate = new Date(
            fromDate.getFullYear(),
            monthNames.indexOf(item.month),
            1
          );
          return itemDate >= fromDate && itemDate <= toDate;
        });
        setChartData(filteredData);
      } else {
        setChartData(initialChartData);
      }
    },
    []
  );

  return (
    <Card className="bg-transparent shadow-none ring-0 border-0">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-base font-semibold">
              Weekly Sales
            </CardTitle>
            <CardDescription>Overview of visits</CardDescription>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-[160px] w-[600px]" // Adjusted width to fill container
          config={chartConfig}
        >
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="#956fd670"
              fillOpacity={0.4}
              stroke="#956fd670"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
