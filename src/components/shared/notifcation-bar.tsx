import React from "react";
import Challenges from "./challenges";

type Props = {};

const Notificationbar: React.FC = (props: Props) => {
  return (
    <section className="col-span-1 ring-1 ring-[#999999] pt-10">
      {" "}
      <Challenges />
    </section>
  );
};

export default Notificationbar;
