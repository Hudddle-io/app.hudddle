import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { X } from "lucide-react";
import Image from "next/image";
import Man from "/assets/man.svg";

const SeeMoreMembers: React.FC = () => {
  return (
    <Card className="p-8 w-[506px] shadow-xl space-y-3">
      <div className="flex justify-end">
        <X size={24} color="gray" className="cursor-pointer" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <>
          <CardContent className="flex items-center justify-start gap-3 p-0">
            <Image
              src={Man.src}
              width={50}
              height={50}
              className="rounded-full object-cover object-center"
              alt="gregory michael"
            />
            <div>
              <CardTitle>Gregory Michael</CardTitle>
              <CardDescription className="text-black text-md py-2">
                Product Design Lead
              </CardDescription>
            </div>
          </CardContent>
          <div
            className=""
            style={{
              background:
                "linear-gradient(to right, black 2%, transparent 2%, transparent 98%, black 98%)",
              position: "relative",
              height: "1.2px",
            }}
          ></div>
        </>
      ))}
    </Card>
  );
};

export default SeeMoreMembers;
