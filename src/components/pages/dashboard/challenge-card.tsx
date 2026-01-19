import React from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface ChallengeCardProps {
  points: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ points }) => {
  return (
    <Card className="p-0 border-0 shadow-none rounded-[12px] overflow-hidden">
      <div className="px-5 py-5 rounded-[12px] bg-gradient-to-b from-[#8F6BD6] to-[#C9B7F2]">
        <CardContent className="flex justify-between items-center px-0 py-0">
          <CardDescription className="text-white font-bold text-base leading-6">
            Complete {points.slice(1)} tasks <br /> within deadline
          </CardDescription>
          <div className="text-custom-yellow items-center gap-1 flex">
            {points}
            <Zap size={18} color="#F18D4B" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ChallengeCard;
