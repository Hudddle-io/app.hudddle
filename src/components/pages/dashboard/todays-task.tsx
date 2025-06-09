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
import NavigationLink from "@/components/basics/Navigation-link";

interface TodaysTaskProps {
  task: TaskTodayProps;
}

const TodaysTasks: React.FC<TodaysTaskProps> = ({ task }) => {
  // Extract the first 6 characters of workroom_id if it exists
  const displayWorkroomId = task.workroom_id
    ? task.workroom_id.substring(0, 6)
    : "";

  return (
    <Card className="rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0">
          <CardTitle className="text-slate-600 text-lg p-0">
            {task.title}
          </CardTitle>
          <CardDescription className="flex p-0">
            <Clock4 size={18} className="mr-2" />
            Due by {task.due_by}
          </CardDescription>
        </div>
        <div className="flex gap-1 items-center p-0 text-custom-yellow">
          +{task.points} <Zap size={18} />
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end p-0">
        {task.workroom_id ? ( // Conditional rendering based on workroom_id
          <span className="text-sm text-gray-500">
            <NavigationLink
              href={`/workroom/room/${task.workroom_id}`}
              variant="ghost"
            >
              From Room - {displayWorkroomId}...
            </NavigationLink>
          </span>
        ) : (
          <Button className="bg-[#5C5CE9]">
            <Plus size={18} className="mr-2" /> Add to workroom
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TodaysTasks;
