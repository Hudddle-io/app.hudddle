import React from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface ChallengeCardProps {
    points: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ points }) => {
    return (
        <Card className="bg-custom-purple hover:bg-purple-700 p-3">
            <CardContent className="flex justify-between items-center px-0 py-0">
                <CardDescription className="text-white font-bold text-sm">
                    Complete {points.slice(1)} tasks <br /> within deadline
                </CardDescription>
                <div className="text-custom-yellow items-center gap-1 flex">
                    {points}
                    <Zap size={18} color="#F18D4B" />
                </div>
            </CardContent>
        </Card>
    );
};

export default ChallengeCard;
