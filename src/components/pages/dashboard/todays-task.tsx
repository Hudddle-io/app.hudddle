import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Clock4, Plus, Zap } from "lucide-react";
import React from "react";
import { TaskTodayProps } from "@/lib/@types";

interface TodaysTaskProps {
  task: TaskTodayProps;
}

const TodaysTasks: React.FC<TodaysTaskProps> = ({ task }) => {
  return (
    <Card className="rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0">
          <CardTitle className="text-slate-600 text-lg p-0">
            {task.title}
          </CardTitle>
          <CardDescription className="flex p-0">
            <Clock4 size={18} className="mr-2" />
            Due by {task.time}
          </CardDescription>
        </div>
        <div className="flex gap-1 items-center p-0 text-custom-yellow">
          +{task.points} <Zap size={18} />
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end p-0">
        <Button className="bg-[#5C5CE9]">
          <Plus size={18} className="mr-2" /> Add to workroom
        </Button>
      </div>
    </Card>
  );
};

export default TodaysTasks;
