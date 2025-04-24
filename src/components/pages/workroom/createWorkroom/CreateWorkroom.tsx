"use client";
import React, { useState } from "react";
import InviteMembers from "../inviteMembers";
import AddTask from "../AddTask";
import Golive from "../Golive";
import WorkroomHeader from "../workroomHeader";
import WorkroomFooter from "../WorkroomFooter";

const CreateWorkroom = () => {
  const [currentstep, setCurrentstep] = useState<number>(1);
  const create_steps = ["Select team members", "add task", "Go live !"];

  return (
    <div className="py-12 px-10 flex flex-col gap-8">
      <WorkroomHeader
        current_step={currentstep}
        header_steps={create_steps}
        headerTitle="create workrooms"
      />

      <div className="flex flex-col neo-effect px-4 py-10 items-center w-full h-fit mt-8 gap-8">
        {/* main content */}
        {currentstep === 1 ? (
          <InviteMembers />
        ) : currentstep === 2 ? (
          <AddTask />
        ) : currentstep === 3 ? (
          <Golive />
        ) : (
          ""
        )}

        <WorkroomFooter
          current_step={currentstep}
          set_current_step={setCurrentstep}
        />
      </div>
    </div>
  );
};

export default CreateWorkroom;
