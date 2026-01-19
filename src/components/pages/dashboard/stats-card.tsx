import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import ProgressBar from "@/components/shared/progress-bar";
import { StatsCardProps } from "@/lib/@types";

const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const getLevelFromProgress = (progress: number) => {
  const safe = clamp(progress);
  if (safe >= 75) return 4;
  if (safe >= 50) return 3;
  if (safe >= 25) return 2;
  return 1;
};

const StatsCard: React.FC<StatsCardProps> = ({
  image,
  title,
  description,
  progressValue,
  progressColor,
}) => {
  const safeProgress = clamp(progressValue);
  const currentLevel = getLevelFromProgress(safeProgress);
  const nextLevel = currentLevel < 4 ? currentLevel + 1 : null;

  return (
    <Card className="border-none px-5 py-6 bg-white shadow-sm rounded-lg space-y-5 neo-effect">
      <CardContent className="p-0 flex gap-2 h-2/4">
        <Image src={image} alt={title} width={30} height={30} />
        <div className="w-3/4">
          <CardTitle className="text-custom-semiBlack text-xl">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-col gap-2 w-1/4 capitalize items-end justify-center">
          <span className="text-primary-hudddleLight font-medium ">
            Level {currentLevel}
          </span>
          <span className="text-custom-semiBlack text-xs">
            up next {nextLevel ? `Level ${nextLevel}` : "Max Level"}
          </span>
        </div>
      </CardContent>
      <ProgressBar
        className="h-14 bg-gray-300 rounded-full"
        progressValue={safeProgress}
        progressColor={progressColor}
      />
    </Card>
  );
};

export default StatsCard;
