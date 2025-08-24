"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProgressBarProps = {
  progressValue: number;
  progressColor: string;
  className?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressValue,
  progressColor,
  className,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setCurrentProgress(progress);
      if (progress >= progressValue) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [progressValue]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Progress
              className={className}
              value={currentProgress}
              color={progressColor}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>{progressValue}%</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProgressBar;
