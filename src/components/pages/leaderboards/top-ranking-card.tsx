import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TopRanksProps } from '@/lib/@types';
import { Clock4 } from 'lucide-react';
import React from 'react';
CardContent

const TopRankingCard: React.FC<TopRanksProps> = ({ rank, name, tools, timeSpent }) => {
    return (
        <Card className={`flex gap-8 items-center ${rank === 1 || rank === 2 || rank === 3 ? 'justify-between' : 'justify-end'} border-none shadow-none`}>
            <div className='flex items-center justify-center gap-3'>
                <CardHeader className='bg-slate-300 font-extrabold rounded-full text-xl text-center grid place-content-center p-4 w-10 h-10'>{rank}</CardHeader>
                {(rank === 1 || rank === 2 || rank === 3) && (
                    <span
                        className={`block badge h-[8px] w-[8px] p-3 ${rank === 1 ? 'bg-custom-orange' : rank === 2 ? 'bg-custom-pink' : 'bg-custom-yellow'
                            } rounded-full`}
                    ></span>
                )}
            </div>
            <CardContent className={`bg-[#e8e0f4] ${rank === 1 || rank === 2 || rank === 3 ? 'w-full' : 'w-[90%]'} rounded-3xl space-y-2 py-1 px-20 h-fit`}>
                <CardTitle className=''>{name}</CardTitle>
                <div className='flex items-center justify-between'>
                    <CardDescription className='flex items-center gap-2'><Clock4 size={18} /><span>Tools used: {tools}</span></CardDescription>
                    <p className='flex items-center gap-1 text-custom-orange font-bold'><Clock4 size={14} /><span>{timeSpent}</span></p>
                </div>
                <div className='border-b-[1px] border-b-slate-300'></div>
            </CardContent>
        </Card>
    )
}

export default TopRankingCard;