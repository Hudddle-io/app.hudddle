import Image from "next/image";
import React, { FC, HTMLAttributes } from "react";

interface ChipProps extends HTMLAttributes<HTMLDivElement> {}

const Chip: FC<ChipProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={
        "flex items-center h-[clamp(1.875rem,_0.6838vh,_2.375rem)] gap-2 p-1 bg-[#956fd649] rounded-[8px] cursor-default text-[clamp(0.75rem,_0.5128vw,_1.125rem)] " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
};

interface ChipImageProps {
  src: string;
}

function ChipImage({ src }: ChipImageProps) {
  return (
    <div className="relative w-[clamp(1.375rem,_0.6838vw,_1.875rem)] h-[clamp(1.375rem,_0.6838vw,_1.875rem)]">
      <Image src={src} alt={"img"} fill className={"rounded-full "} />
    </div>
  );
}
function ChipTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={
        "font-normal text-[18px] leading-[20px]  capitalize" + className
      }
    >
      {children}
    </h2>
  );
}

export { Chip, ChipImage, ChipTitle };
