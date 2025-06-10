// header title
// steps
// current step
import React, { FC } from "react";
import { Header, HeaderTexts } from "./Header";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateUniqueKey } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface WorkroomHeader {
  type: "create" | "edit";
  headerTitle: string;
  header_steps: string[];
  current_step: number;
}

const WorkroomHeader: FC<WorkroomHeader> = ({
  type,
  header_steps,
  current_step,
  headerTitle,
}) => {
  return (
    <Header>
      <HeaderTexts>
        <div className="flex items-center">
          <Button
            onClick={() => {
              window.history.back();
            }}
            variant={"ghost"}
          >
            <MoveLeft className="stroke-[1px] text-[#4D4D4D]" />
          </Button>
          <h3 className="font-semibold text-[clamp(1.2rem,_1.2vw,_1.8rem)] text-[#4D4D4D]">
            {headerTitle} :{" "}
            {type === "create" ? (
              <span className="font-light text-[clamp(0.5rem,_0.6838vw,_1rem)] leading-[22px]">
                Add teams, Tasks, Kpi&apos;s to properly manage your Results
              </span>
            ) : (
              <span className="font-light text-[clamp(0.5rem,_0.6838vw,_1rem)] leading-[22px]">
                Edit teams, Tasks, Kpi&apos;s to properly manage your Results
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-2 pl-8">
          {header_steps.map((step, i) => {
            const { _id } = generateUniqueKey(step);

            return (
              <div
                key={_id}
                className="flex flex-col justify-between h-[clamp(1.375rem,_1.3675vh,_2.375rem)]"
              >
                <Progress
                  color="#956FD666 "
                  className="w-[clamp(11.8125rem,_3.3906vw,_14.2919rem)] bg-[#D9D9D9]"
                  value={
                    current_step === i + 1 || i + 1 < current_step ? 100 : 0
                  }
                />
                <span
                  className={`font-normal text-[clamp(0.75rem,_0.5128vw,_1.125rem)] translate-y-2 text-[#956FD6] ${
                    current_step === i + 1 || i + 1 < current_step
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </HeaderTexts>
    </Header>
  );
};

export default WorkroomHeader;
