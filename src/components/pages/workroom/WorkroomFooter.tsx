// current step
// setCurrent step

import { Button } from "@/components/ui/button";
import { SkipBack, SkipForward } from "lucide-react";
import React, { FC } from "react";

interface WorkroomFooterProps {
  current_step: number;
  set_current_step: any;
}

const WorkroomFooter: FC<WorkroomFooterProps> = ({
  current_step,
  set_current_step,
}) => {
  return (
    <footer className="flex w-full justify-between mt-10">
      <Button
        onClick={() => {
          set_current_step((prev: number) => prev - 1);
        }}
        disabled={current_step > 1 ? false : true}
        className={`h-[clamp(2.25rem,_1.3675vh,_3.25rem)] w-[clamp(6.25rem,_2.906vw,_8.375rem)] flex-col font-normal text-[#956FD6] disabled:text-[#C4C4C4] hover:bg-transparent`}
        variant={"ghost"}
      >
        <span className="self-end text-[clamp(0.5rem,_0.3419vw,_0.75rem)] leading-[16px]">
          previous
        </span>
        <span className="flex items-center gap-2 text-[clamp(0.75rem,_0.5128vw,_1.125rem)] leading-[22px]">
          <SkipBack />{" "}
          {current_step == 1
            ? ""
            : current_step === 2
            ? "Create Workroom"
            : current_step === 3
            ? "Invite Members"
            : current_step === 4
            ? "Add Task"
            : ""}
        </span>
      </Button>
      {current_step === 4 ? (
        ""
      ) : (
        <Button
          disabled={current_step === 4 ? true : false}
          onClick={() => {
            set_current_step((prev: number) => prev + 1);
          }}
          className="h-[clamp(2.25rem,_1.3675vh,_3.25rem)] w-[clamp(6.25rem,_2.906vw,_8.375rem)] flex-col font-normal text-[#956FD6] disabled:text-[#C4C4C4] hover:bg-transparent"
          variant={"ghost"}
        >
          <span className="self-start text-[clamp(0.5rem,_0.3419vw,_0.75rem)] leading-[16px]">
            next:
          </span>
          <span className="flex items-center gap-2 text-[clamp(0.75rem,_0.5128vw,_1.125rem)] leading-[22px]">
            <SkipForward />
            {current_step === 1
              ? "Select Friends"
              : current_step === 2
              ? "Add or Create Task"
              : current_step === 3
              ? "Go Live"
              : ""}
          </span>
        </Button>
      )}
    </footer>
  );
};

export default WorkroomFooter;
