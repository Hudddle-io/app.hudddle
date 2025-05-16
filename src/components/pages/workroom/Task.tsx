import { Clock5 } from "lucide-react";
import React, { FC, HTMLAttributes, HtmlHTMLAttributes } from "react";

interface TaskProps extends HTMLAttributes<HTMLDivElement> {}

const Task: FC<TaskProps> = ({ className, children, ...props }) => {
  return (
    <div
      {...props}
      className={
        "w-full py-[6px] h-[clamp(2.8125rem,_1.2821vw,_3.75rem)] border-b-[1px] border-[#999999] flex items-center justify-between  " +
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
    <div
      className={"flex flex-col justify-between py-[2px]" + className}
      {...props}
    >
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
        "font-bold text-[clamp(0.875rem,_0.8066rem+0.3419vw,_1.125rem)] " +
        className
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
      <Clock5 className="text-[#999999] font-thin text-[clamp(0.9375rem,_0.852rem+0.4274vw,_1.25rem)]" />
      <span className="text-[#999999] font-normal text-[clamp(0.625rem,_0.5566rem+0.3419vw,_0.875rem)] ">
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
