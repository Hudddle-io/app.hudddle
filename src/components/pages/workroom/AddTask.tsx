import { tasks } from "@/data/workroom";
import { generateUniqueKey } from "@/lib/utils";
import React from "react";
import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

const AddTask = (props: Props) => {
  return (
    <div className="flex flex-col gap-4 w-full px-16">
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
      <footer className="w-full flex flex-col gap-1 ">
        <Link
          className="underline self-end text-[#999999] font-normal text-[14px] leading-[20px]"
          href={"/tasks"}
        >
          See all
        </Link>

        <Button className="bg-[#956FD6] text-white mx-auto px-16 ">
          Create a new Task
        </Button>
      </footer>
    </div>
  );
};

export default AddTask;
