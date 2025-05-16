import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import ProgressBar from '@/components/shared/progress-bar';
import { StatsCardProps } from '@/lib/@types';

type UserLevelCategory = 'Leader' | 'Workaholic' | 'Team Player' | 'Slacker';

const calculateProgressPercentage = (points: number, category: UserLevelCategory): number => {
  const thresholds = {
    Leader: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
    Workaholic: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
    "Team Player": { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
    Slacker: { Beginner: 0, Intermediate: 50, Advanced: 150, Expert: 300 },
  };

  const currentCategoryThresholds = thresholds[category];
  if (!currentCategoryThresholds) return 0;

  let lowerBound = 0;
  let upperBound = Infinity;

  if (points < currentCategoryThresholds.Intermediate) {
    upperBound = currentCategoryThresholds.Intermediate;
  } else if (points < currentCategoryThresholds.Advanced) {
    lowerBound = currentCategoryThresholds.Intermediate;
    upperBound = currentCategoryThresholds.Advanced;
  } else if (points < currentCategoryThresholds.Expert) {
    lowerBound = currentCategoryThresholds.Advanced;
    upperBound = currentCategoryThresholds.Expert;
  } else {
    return 100;
  }

  const progress = ((points - lowerBound) / (upperBound - lowerBound)) * 100;
  return Math.max(0, Math.min(100, progress));
};

const StatsCard: React.FC<StatsCardProps> = ({ image, title, description, progressValue, progressColor }) => {
  return (
    <Card className='border-none p-4 rounded-md space-y-5 neo-effect'>
      <CardContent className='p-0 flex gap-2'>
        <Image src={image} alt={title} width={30} height={30} />
        <div>
          <CardTitle className='text-custom-semiBlack text-xl'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardContent>
      <ProgressBar
        className='h-10 rounded-full'
        progressValue={calculateProgressPercentage(progressValue, title as UserLevelCategory)}
        progressColor={progressColor}
      />
    </Card>
  );
};

export default StatsCard;
