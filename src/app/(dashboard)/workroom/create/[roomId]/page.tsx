"use client";

import CreateWorkroom from "@/components/pages/workroom/createWorkroom/CreateWorkroom";
import React from "react";
import { useParams } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div>
      <CreateWorkroom></CreateWorkroom>
    </div>
  );
};

export default Page;
