import React from "react";
import { Header, HeaderActions, HeaderTexts } from "./Header";
import { workroomMembers, workroomtasks } from "@/data/workroom";
import { generateUniqueKey } from "@/lib/utils";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Button } from "@/components/ui/button";

import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import GoliveButton from "@/components/shared/golive-components/golive-button";

type Props = {};

const Golive = (props: Props) => {
  return (
    <motion.div className="relative w-3/4 h-3/4 rounded-[6px] neo-effect border-[1px] border-[#091E4224] p-6 flex flex-col gap-8">
      <Header>
        <HeaderTexts>
          <h2 className="font-bold text-[18px] leading-[22px] text-[#262626]">
            Your team members
          </h2>
          <HeaderActions className="flex-wrap">
            {workroomMembers.map((member) => {
              const { _id } = generateUniqueKey(member.name);
              return (
                <Chip key={_id}>
                  <ChipImage src={member.img} />
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
        <h2 className="font-bold text-[18px] leading-[22px] text-[#262626]">
          Workroom Tasks
        </h2>
        {workroomtasks.map((task) => {
          const { _id } = generateUniqueKey(task.title);

          return (
            <Task key={_id}>
              <TaskDescription>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDueTime>{task.Due}</TaskDueTime>
              </TaskDescription>
              <TaskActions>
                <span className="text-[#EEAE05] flex items-center">
                  +<Zap width={12} height={12} />
                  {task.points}
                </span>
              </TaskActions>
            </Task>
          );
        })}
      </div>
      <GoliveButton />
    </motion.div>
  );
};

export default Golive;
