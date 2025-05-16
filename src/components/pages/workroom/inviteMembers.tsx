import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  stepsData: any;
  setStepsData: React.Dispatch<any>;
}

const InviteMembers = ({ stepsData, setStepsData }: Props) => {
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");

  const handleAddMember = () => {
    if (email.trim() !== "") {
      setMembers((prev) => [...prev, email.trim()]);
      setEmail("");
    }
  };

  return (
    <main className="flex flex-col gap-[clamp(1.5rem,_0.6838vw,_2rem)]">
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="addTeamMembers"
          className="font-normal text-[clamp(0.75rem,_0.5128vw,_1.125rem)] leading-[16px] text-[#44546F]"
        >
          Add your friends to <span className="font-bold">Work room name</span>
        </label>
        <span className="flex gap-[clamp(1.5rem,_0.6838vw,_2rem)] items-center">
          <Input
            className="w-[clamp(18rem,_4.1026vw,_21rem)] h-[clamp(2.25rem,_2.0513vw,_3.75rem)] neo-effect ring-1 ring-[#091E4224] text-[#626F86] text-[clamp(0.75rem,_0.5128vw,_1.125rem)] leading-[20px] font-normal outline-none"
            placeholder="Email address"
            name="addTeamMembers"
            id="addTeamMembers"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button id="add" variant="ghost" onClick={handleAddMember}>
            <Plus className="text-[#956FD666] w-[clamp(0.7rem,_0.5128vw,_0.875rem)] h-[clamp(0.7rem,_0.5128vh,_0.875rem)] text-[clamp(0.5rem,_0.5128vw,_0.875rem)]" />
          </Button>
        </span>
      </div>
      <div className="w-[clamp(20.5rem,_5.9829vw,_21.875rem)] flex flex-wrap h-fit gap-2">
        {members.length === 0 ? (
          <p className="text-[#999999]">No members yet</p>
        ) : (
          members.map((member, index) => (
            <Chip key={index}>
              <ChipImage src="/assets/images/member1.png" />
              <ChipTitle>{member}</ChipTitle>
            </Chip>
          ))
        )}
      </div>
      <Button className="w-[clamp(17.5rem,_4.2735vw,_20.625rem)] bg-[#956FD699] mt-[clamp(1.875rem,_0.8547vw,_2.5rem)]">
        Invite team members
      </Button>
    </main>
  );
};

export default InviteMembers;
