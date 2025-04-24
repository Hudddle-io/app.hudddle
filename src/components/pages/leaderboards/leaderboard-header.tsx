import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { LeaderBoardHeaderProps } from '@/lib/@types';
import { Clock4, LucideIcon, Zap } from 'lucide-react'
import React from 'react'


interface StatCardProps {
    description: string;
    value: string;
    Icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ description, value, Icon }) => {
    return (
        <CardContent className={`rounded-none p-0 h-fit`}>
            <CardDescription className='whitespace-nowrap p-0'>{description}</CardDescription>
            <h1 className='text-custom-yellow whitespace-nowrap font-bold gap-1 text-lg flex items-center'>
                {description.trim() !== "Total Hours".trim() ? <>{value} < Icon size={18} color='#EEAE05' fill='#EEAE05' /></>
                    : <><Icon size={18} color='#EEAE05' /> {value}</>
                }
            </h1>
        </CardContent>
    );
};


const LeaderBoardHeader: React.FC<LeaderBoardHeaderProps> = ({ companyName, teamName, points, totalHours }) => {
    return (
        <Card className='grid gap-6 p-0 grid-cols-9 items-center rounded-none border-none shadow-none bg-transparent'>
            <div className="col-span-6">
                <p className='text-md text-custom-semiBlack font-semibold'>
                    {companyName}
                </p>
                <h1 className='text-3xl text-custom-semiBlack font-semibold'>
                    {teamName} Leaderboard
                </h1>
            </div>
            <div className="col-span-3 gap-10 flex items-center justify-start">
                <StatCard description='Your points' value={`${points}`} Icon={Zap} />
                <div className='border-r-[1px] h-14 border-r-slate-300 w-[2px]'></div>
                <StatCard description='Total Hours' value={totalHours} Icon={Clock4} />
            </div>
        </Card>
    );
}

export default LeaderBoardHeader;