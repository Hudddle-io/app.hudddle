// current step
// setCurrent step

import { Button } from "@/components/ui/button";
import {
  SkipBack,
  SkipForward,
  ExternalLink,
  SquareArrowOutUpLeft,
} from "lucide-react";
import React, { FC } from "react";
import NavigationLink from "@/components/basics/Navigation-link";

interface WorkroomFooterProps {
  type: "create" | "edit";
  workroomId: string | null;
  current_step: number;
  set_current_step: any;
}

const WorkroomFooter: FC<WorkroomFooterProps> = ({
  type,
  workroomId,
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
            ? type === "create"
              ? "Create Workroom"
              : "Edit Workroom"
            : current_step === 3
            ? type === "create"
              ? "Create Kpi's"
              : "Edit Kpi's"
            : current_step === 4
            ? type === "create"
              ? "Invite Members"
              : "Edit Members"
            : current_step === 5
            ? type === "create"
              ? "Add Tasks"
              : "Edit Tasks"
            : ""}
        </span>
      </Button>
      {current_step === 5 ? (
        <div className="flex items-center justify-end gap-4">
          <NavigationLink
            icon={{ icon_component: <SquareArrowOutUpLeft /> }}
            href="/workroom"
            variant={"ghost"}
          >
            View all Workrooms
          </NavigationLink>
          <NavigationLink
            icon={{ icon_component: <ExternalLink /> }}
            href={`/workroom/room/${workroomId && workroomId}`}
          >
            Open Workroom
          </NavigationLink>
        </div>
      ) : (
        <Button
          disabled={current_step === 5 ? true : false}
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
              ? type === "create"
                ? "Create Kpi's"
                : "Edit Kpi's"
              : current_step === 2
              ? type === "create"
                ? "Invite Members"
                : "Edit Members"
              : current_step === 3
              ? type === "create"
                ? "Add or Create Task"
                : "Edit Tasks"
              : current_step === 4
              ? "Go Live"
              : ""}
          </span>
        </Button>
      )}
    </footer>
  );
};

export default WorkroomFooter;
