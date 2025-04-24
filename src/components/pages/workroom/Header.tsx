import React, { FC, HTMLAttributes } from "react";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {}

const Header: FC<HeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={"flex w-full justify-between " + className} {...props}>
      {children}
    </div>
  );
};

function HeaderTexts({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"flex flex-col gap-2 " + className} {...props}>
      {children}
    </div>
  );
}
function HeaderActions({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={" flex items-baseline gap-2 " + className} {...props}>
      {children}
    </div>
  );
}

export { Header, HeaderTexts, HeaderActions };
