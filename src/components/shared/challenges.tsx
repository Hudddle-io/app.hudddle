import React from 'react';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ChallengeCard from '@/components/pages/dashboard/challenge-card';
import { Card } from '../ui/card';



const Challenges: React.FC = () => {
  return (
    <section className=" h-screen py-8 px-6 md:px-4 sm:px-2">
      <div className="bg-[#F2F2F2] flex rounded-md justify-between items-center px-3 py-2">
        <h1 className="font-bold text-xl text-custom-semiBlack">Daily Challenges</h1>
        <div className="bg-white h-8 w-8 grid place-content-center rounded-full">
          <Star size={18} color="#EEAE05" fill="#EEAE05" />
        </div>
      </div>
      <Separator className="border-b-[2px] border-slate-200 my-4" />
      <Card className='relative border-0 p-3 mt-8 space-y-3 neo-effect'>
        <div className="overlay"></div>
        {[1, 2, 3, 4].map((_, i) => (
          <ChallengeCard points={`+${10}`} key={i} />
        ))}
      </Card>
    </section>
  );
};

export default Challenges;
