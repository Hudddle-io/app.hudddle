import React from "react";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ChallengeCard from "@/components/pages/dashboard/challenge-card";
import { Card } from "../ui/card";

const Challenges: React.FC = () => {
  return (
    <section className="h-screen px-6 py-6">
      <div className="bg-white flex rounded-[12px] justify-between items-center px-5 py-5 border border-slate-200">
        <h1 className="font-bold text-lg text-custom-semiBlack leading-tight">
          Daily
          <br />
          Challenges
        </h1>
        <div className="bg-white h-9 w-9 grid place-content-center rounded-full border border-slate-200">
          <Star size={18} color="#EEAE05" fill="#EEAE05" />
        </div>
      </div>
      <Separator className="border-b-[2px] border-slate-200 my-5" />
      <Card className="relative border-0 p-4 mt-6 space-y-4 bg-transparent shadow-none">
        <div className="overlay"></div>
        {[1, 2, 3, 4].map((_, i) => (
          <ChallengeCard points={`+${10}`} key={i} />
        ))}
      </Card>
    </section>
  );
};

export default Challenges;
