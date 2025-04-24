import Image from "next/image";
import React, { FC, HTMLAttributes } from "react";

interface ChipProps extends HTMLAttributes<HTMLDivElement> {}

const Chip: FC<ChipProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={
        "flex items-center gap-4 p-2 bg-[#956FD666] rounded-[8px] cursor-default " +
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
    <Image
      src={src}
      alt={"img"}
      width={30}
      height={30}
      className={"rounded-full "}
    />
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
        "font-normal text-[18px] leading-[20px]  capitalize" +
        className
      }
    >
      {children}
    </h2>
  );
}

export { Chip, ChipImage, ChipTitle };
