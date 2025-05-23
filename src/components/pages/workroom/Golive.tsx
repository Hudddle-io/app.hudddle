import React, { useEffect } from "react";
import { Header, HeaderActions, HeaderTexts } from "./Header";

import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import NavigationLink from "@/components/basics/Navigation-link";
import { Button } from "@/components/ui/button";

import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import { Zap, ExternalLink, SquareArrowOutUpLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { WorkroomDetails } from "@/lib/fetch-workroom";

interface Props {
  stepsData: any;
  workroomId: string | null;
  data: WorkroomDetails | null;
  setStepsData: React.Dispatch<any>;
  onLoad?: () => void;
}

const Golive = ({ stepsData, workroomId, data, setStepsData }: Props) => {
  return (
    <motion.div className="relative w-3/4 h-3/4 rounded-[6px] p-6 flex flex-col gap-8">
      <Header>
        <HeaderTexts>
          <h2 className="font-bold text-[18px] leading-[22px] text-[#262626]">
            Your team members
          </h2>
          <HeaderActions className="flex-wrap">
            {data?.members.map((member) => {
              return (
                <Chip key={member.name}>
                  <ChipImage src={member.avatar_url} />
                  <ChipTitle>{member.name}</ChipTitle>
                </Chip>
              );
            })}

            <Button
              className="text-[18px] leading-[20px] font-normal text-[#956FD699]"
              variant={"ghost"}
            >
              + 4 Others
            </Button>
          </HeaderActions>
        </HeaderTexts>
      </Header>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="font-bold text-[clamp(0.9375rem,_0.4274vw,_1.25rem)] leading-[22px] text-[#956FD6]">
          Workroom Tasks
        </h2>
        {data?.tasks.map((task) => {
          return (
            <Task key={task.id}>
              <TaskDescription>
                <TaskTitle className="text-[#211451] text-[clamp(0.9375rem,_0.4274vw,_1.25rem)]">
                  {task.title}
                </TaskTitle>
                <TaskDueTime>{task.due_by}</TaskDueTime>
              </TaskDescription>
              <TaskActions>
                <span className="text-[#EEAE05] flex items-center text-[clamp(0.5rem, _0.2564vw, _0.6875rem)]">
                  +<Zap width={10} height={10} />
                  {task.task_point}
                </span>

                <Button
                  variant={"ghost"}
                  className="text-[#EF5A63] text-[clamp(0.625rem,_0.1709vw,_0.75rem)] hover:bg-transparent ml-[clamp(1.375rem,_1.2821vw,_2.3125rem)]"
                >
                  Remove
                </Button>
              </TaskActions>
            </Task>
          );
        })}
      </div>
      <footer className="flex items-center justify-end gap-4">
        <NavigationLink
          icon={{ icon_component: <SquareArrowOutUpLeft /> }}
          href="/workroom"
          variant={"ghost"}
        >
          View all Workrooms
        </NavigationLink>
        <NavigationLink
          icon={{ icon_component: <ExternalLink /> }}
          href={`/workroom/room/${workroomId}`}
        >
          Open Workroom
        </NavigationLink>
      </footer>
      {/* <GoliveButton /> */}
    </motion.div>
  );
};

export default Golive;
