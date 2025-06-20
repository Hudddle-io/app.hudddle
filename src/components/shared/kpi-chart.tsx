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
  // Data for the speedometer: We'll use this single percentage for all three bars
  // to ensure they all reflect the same overall alignment, but will be visually distinct.
  const chartData = [
    {
      name: "Overall KPI Alignment",
      value: overallAlignmentPercentage,
    },
  ];

  // Chart configuration for tooltips and general color scheme
  const chartConfig = {
    "Overall KPI Alignment": {
      label: "Overall KPI Alignment",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col bg-transparent shadow-none border-0 ring-0">
      {/* Set a fixed height and width for CardContent to guarantee chart has space */}
      <CardContent
        className="flex items-center justify-center p-4"
        style={{ height: "300px", width: "200px" }}
      >
        <ChartContainer
          config={chartConfig}
          className="w-full h-full flex items-center justify-center"
        >
          <ResponsiveContainer width="100%" height="100%">
            {/* THIS IS THE SINGLE RADIALBARCHART INSTANCE housing all concentric bars */}
            <RadialBarChart
              data={chartData}
              // Keep start/end angles for the speedometer arc design
              startAngle={360}
              endAngle={0}
              cx="50%" // Center X of the chart within its SVG
              cy="50%" // Center Y of the chart within its SVG
              innerRadius={70} // Set inner radius for the chart
              outerRadius={110} // Set outer radius for the chart
              barSize={20} // Increased bar size for thicker bars
              width={400} // Increased chart width
              height={400} // Increased chart height
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
                            y={cy - 20} // Adjusted Y position for percentage for better spacing in larger chart
                            className="fill-foreground text-2xl font-bold"
                            fill="#211451"
                          >
                            {overallAlignmentPercentage.toFixed(0)}%
                          </tspan>
                          <tspan
                            x={cx}
                            y={cy + 10} // Adjusted Y position for KPI name for better spacing in larger chart
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
