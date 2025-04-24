import React from "react";
import { Header, HeaderTexts } from "./Header";
import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasks } from "@/data/workroom";
import { generateUniqueKey } from "@/lib/utils";

type Props = {};

const WorkroomTasks = (props: Props) => {
  return (
    <div className="mt-10 flex flex-col gap-2">
      <Header>
        <HeaderTexts className="text-[#707070] font-semibold text-[21px] leading-[24px]">
          Tasks
        </HeaderTexts>
      </Header>
      <div className="neo-effect p-8 rounded-[16px] w-full h-fit flex flex-col gap-2">
        {tasks.map((task) => {
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
                <Button className="bg-[#956FD6] text-white">
                  <Plus className="w-[20px] h-[20px]" /> Add to workroom
                </Button>
              </TaskActions>
            </Task>
          );
        })}
      </div>
    </div>
  );
};

export default WorkroomTasks;
