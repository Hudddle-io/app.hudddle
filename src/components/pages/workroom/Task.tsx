import { Clock5 } from "lucide-react";
import React, { FC, HTMLAttributes, HtmlHTMLAttributes } from "react";

interface TaskProps extends HTMLAttributes<HTMLDivElement> {}

const Task: FC<TaskProps> = ({ className, children, ...props }) => {
  return (
    <div
      {...props}
      className={
        "w-full py-[10px] border-b-[1px] border-[#999999] flex items-center justify-between  " +
        className
      }
    >
      {children}
    </div>
  );
};

function TaskDescription({
  children,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"flex flex-col gap-2 " + className} {...props}>
      {children}
    </div>
  );
}
function TaskTitle({
  children,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={
        "text-[18px] font-bold leading-[22px] text-[#999999] " + className
      }
      {...props}
    >
      {children}
    </h3>
  );
}
function TaskDueTime({
  children,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"flex items-center gap-[16px]  " + className} {...props}>
      <Clock5 className="text-[#999999] font-thin " />
      <span className="text-[#999999] font-normal text-[14px] ">
        Due by {children}
      </span>
    </div>
  );
}
function TaskActions({
  children,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"flex items-center gap-[16px]  " + className} {...props}>
      {children}
    </div>
  );
}

export { Task, TaskDescription, TaskTitle, TaskDueTime, TaskActions };
