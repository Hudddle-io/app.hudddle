import React from "react";

import { Input } from "@/components/ui/input";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {};

const InviteMembers = (props: Props) => {
  return (
    <main className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="addTeamMembers"
          className="font-normal text-[16px] leading-[16px] text-[#44546F]"
        >
          Add team members
        </label>
        <span className="flex gap-8 items-center">
          <Input
            className="w-[336px] h-[60px] neo-effect ring-1 ring-[#091E4224] text-[#626F86] text-[18px] leading-[20px] font-normal outline-none"
            placeholder="Email address"
            name="addTeamMembers"
            id="addTeamMembers"
            type="email"
          />
          <Button variant={"ghost"}>
            <Plus className="text-[#956FD666] w-[14px] h-[14px] text-[14px]" />
          </Button>
        </span>
      </div>
      <div className="w-[350px] flex flex-wrap h-fit gap-2">
        <Chip>
          <ChipImage src="/assets/images/member1.png" />
          <ChipTitle>amaka ezeocha</ChipTitle>
        </Chip>
        <Chip>
          <ChipImage src="/assets/images/member1.png" />
          <ChipTitle>latemin</ChipTitle>
        </Chip>
        <Chip>
          <ChipImage src="/assets/images/member1.png" />
          <ChipTitle>onyema ihuoma joe</ChipTitle>
        </Chip>
        <Chip>
          <ChipImage src="/assets/images/member1.png" />
          <ChipTitle>dave</ChipTitle>
        </Chip>
        <Chip>
          <ChipImage src="/assets/images/member1.png" />
          <ChipTitle>latema chidinma ofestus</ChipTitle>
        </Chip>
      </div>

      <Button className="w-[330px] bg-[#956FD699] mt-10">
        Invite team members
      </Button>
    </main>
  );
};

export default InviteMembers;