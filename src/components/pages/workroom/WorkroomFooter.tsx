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
        className={`h-[47px] flex-col font-normal text-[#956FD6] disabled:text-[#C4C4C4] hover:bg-transparent`}
        variant={"ghost"}
      >
        <span className="self-end text-[12px] leading-[16px]">previous</span>
        <span className="flex items-center gap-2 text-[18px] leading-[22px]">
          <SkipBack />{" "}
          {current_step === 1
            ? "Create Workrrom"
            : current_step === 2
            ? "Invite Members"
            : current_step === 3
            ? "Add Task"
            : ""}
        </span>
      </Button>
      {current_step === 3 ? (
        ""
      ) : (
        <Button
          disabled={current_step === 3 ? true : false}
          onClick={() => {
            set_current_step((prev: number) => prev + 1);
          }}
          className="h-[47px] flex-col font-normal text-[#956FD6] disabled:text-[#C4C4C4] hover:bg-transparent"
          variant={"ghost"}
        >
          <span className="self-start text-[12px] leading-[16px]">next:</span>
          <span className="flex items-center gap-2 text-[18px] leading-[22px]">
            <SkipForward />
            {current_step === 1
              ? "Add Task"
              : current_step === 2
              ? "Go live"
              : ""}
          </span>
        </Button>
      )}
    </footer>
  );
};

export default WorkroomFooter;
