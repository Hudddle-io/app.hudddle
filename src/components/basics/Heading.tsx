import { FC, HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: "default" | "secondary" | "bigCardTitle" | "smallCardTitle";
}
export const MainHeading: FC<HeadingProps> = ({
  children,
  className,
  variant,
}) => {
  if (variant === "default") {
    return (
      <h1
        className={
          className +
          " font-inria leading-[55px] text-[clamp(1.25rem,_2.5641vw,_3.125rem)] font-bold"
        }
      >
        {children}
      </h1>
    );
  }
  if (variant === "secondary") {
    return (
      <h1
        className={
          className +
          " font-inria leading-[55px] text-[clamp(1.375rem,_1.2821vw,_2.3125rem)] font-bold"
        }
      >
        {children}
      </h1>
    );
  }
  if (variant === "bigCardTitle") {
    return (
      <h1
        className={
          className +
          "leading-[28px] text-[clamp(1.375rem,_1.2821vw,_2.3125rem)] font-bold"
        }
      >
        {children}
      </h1>
    );
  }
  if (variant === "smallCardTitle") {
    return (
      <h1
        className={
          className +
          "leading-[28px] text-[clamp(1rem,_0.4274vw,_1.3125rem)] font-bold"
        }
      >
        {children}
      </h1>
    );
  }

  // default
  return (
    <h1
      className={
        className +
        " font-inria leading-[55px] text-[clamp(1.25rem,_2.5641vw,_3.125rem)] font-bold"
      }
    >
      {children}
    </h1>
  );
};

export const SubHeading: FC<HeadingProps> = ({ children, className }) => {
  return (
    <h3
      className={
        className +
        " font-inria leading-[24px] text-[clamp(0.75rem,_0.7692vw,_1.3125rem)] font-normal"
      }
    >
      {children}
    </h3>
  );
};
