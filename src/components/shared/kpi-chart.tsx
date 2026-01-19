"use client";

import {
  Label,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface KpiChartProps {
  overallAlignmentPercentage: number;
}

function KpiChart({ overallAlignmentPercentage }: KpiChartProps) {
  const safePercentage = Number.isFinite(overallAlignmentPercentage)
    ? Math.max(0, Math.min(100, overallAlignmentPercentage))
    : 0;

  const chartData = [
    {
      name: "Overall KPI Alignment",
      value: safePercentage,
    },
  ];

  const chartConfig = {
    "Overall KPI Alignment": {
      label: "Overall KPI Alignment",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-transparent shadow-none border-0 ring-0 w-full h-full">
      <CardContent className="flex items-start justify-center pt-2 w-full h-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              cx="50%"
              cy="70%"
              innerRadius={50}
              outerRadius={80}
              barSize={14}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              {/* PolarAngleAxis to define the angular range for the speedometer */}
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
                axisLine={false}
              />

              {/* Middle RadialBar - Blue Violet (Medium thickness, positioned between outer and inner) */}
              <RadialBar
                angleAxisId={0}
                dataKey="value"
                cornerRadius={5}
                fill="#8A2BE2" // Blue Violet
                isAnimationActive={true}
                animationEasing="ease-out"
                animationDuration={1000}
                background={{ fill: "#E0B0FF" }} // Add light purple background
              />

              {/* PolarRadiusAxis to host the Label component for central text */}
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  className="re-label"
                  content={({ viewBox }) => {
                    const polarViewBox = viewBox as { cx: number; cy: number };
                    if (
                      polarViewBox &&
                      typeof polarViewBox.cx === "number" &&
                      typeof polarViewBox.cy === "number"
                    ) {
                      const { cx, cy } = polarViewBox;
                      return (
                        <text
                          x={cx}
                          y={cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={cx}
                            y={cy - 22}
                            className="fill-foreground text-2xl font-bold"
                            fill="#211451"
                          >
                            {safePercentage.toFixed(0)}%
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 12}
                            className="text-[clamp(0.65rem,_0.6158rem+0.1709vw,_0.775rem)] text-[#211451]"
                            fill="#211451"
                          >
                            Overall KPI Alignment
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default KpiChart;
