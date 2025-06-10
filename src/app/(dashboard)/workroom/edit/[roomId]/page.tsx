"use client";

import EditWorkroom from "@/components/pages/workroom/EditWorkroom/EditWorkroom";
import React from "react";
import { useParams } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div>
      <EditWorkroom />
    </div>
  );
};

export default Page;
