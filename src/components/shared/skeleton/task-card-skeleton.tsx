import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Clock4 } from "lucide-react";

const TaskCardSkeleton: React.FC = () => {
  return (
    <Card className="rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-24 h-6" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-16 h-4" />
            <Clock4 size={18} className="text-slate-300" />
          </div>
        </div>
        <div className="flex gap-1 items-center p-0 text-custom-yellow">
          <Skeleton className="w-10 h-4" />
          <Zap size={18} />
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end p-0">
        <Button className="bg-custom-purple">
          <Plus size={18} className="mr-2" />
          <Skeleton className="w-20 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCardSkeleton;
