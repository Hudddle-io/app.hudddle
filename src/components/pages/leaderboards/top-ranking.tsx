import { Card } from '@/components/ui/card';
import React from 'react';
import TopRankingCard from './top-ranking-card';
import { topRanksData } from '@/data/data';




const TopRanking :React.FC = () => {
    return (
        <Card className='mt-5 p-8 border-0 space-y-5 neo-effect'>
            {topRanksData.slice(0, 3).map((rank, i) => (
                <TopRankingCard
                    key={rank.rank}
                    rank={rank.rank}
                    name={rank.name}
                    tools={rank.tools}
                    timeSpent={rank.timeSpent}
                />
            ))}
            <div className='border-b-[2px] border-b-slate-300'></div>
            {topRanksData.slice(3).map((rank, i) => (
                <TopRankingCard
                    key={rank.rank}
                    rank={rank.rank}
                    name={rank.name}
                    tools={rank.tools}
                    timeSpent={rank.timeSpent}
                />
            ))}
        </Card>
    )
}

export default TopRanking;