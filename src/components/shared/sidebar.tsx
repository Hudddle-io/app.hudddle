"use client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import React, { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Dribbble, Figma, Home, LogOut } from "lucide-react";
import { sideLinks } from "@/data/data";
import { useUserSession } from "@/contexts/useUserSession";
import { useRouter } from "next/navigation";
import pinterest from "../../../public/assets/pinterest.svg";
import dribble from "../../../public/assets/dribble.svg";


interface UserOnlineStatusProps extends HTMLAttributes<HTMLDivElement> {
  isOnline: boolean;
  statusText?: boolean | string;
}
const onlinestatusstyles = cva("flex items-center gap-2");
export const UserOnlineStatus: FC<UserOnlineStatusProps> = ({
  isOnline,
  statusText,
  className,
}) => {
  return (
    <div className={cn(onlinestatusstyles({ className }))}>
      {!isOnline ? (
        <span className="w-2 h-2 bg-slate-200 rounded-full" />
      ) : (
        <span className="w-2 h-2 bg-[#ADD359] rounded-full" />
      )}
      {statusText && (
        <h6
          className={`text-xs ${
            !isOnline ? "text-slate-200" : "text-[#ADD359]"
          }`}
        >
          {isOnline ? "Online" : statusText}
        </h6>
      )}
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const {loading, error, currentUser, logout: logoutContext } = useUserSession();   
  const handleLogout = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      logoutContext();
      router.push("/auth/Sign-in");
      return;
    }
    try {
      const response = await fetch("https://hudddle-backend.onrender.com/api/v1/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData);
        if (response.status === 401) {
          logoutContext();
          router.push('/auth/Sign-in');
          return;
        }
        throw new Error(errorData.message || 'Logout failed');
      }
      
      logoutContext();
      router.push('/auth/Sign-in');
    } catch (error) {
      toast.error("Network Error", {
        description: "Could not connect to the server",
      });
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem('token');
    }
  };
  return (
    <section className="col-span-1 ring-1 ring-[#999999] flex items-start justify-center py-10 px-6">
      <div className="w-full h-full flex flex-col gap-[40px] items-center">
        <Link href={"/"}>
          <Image src={"/assets/logo.svg"} alt="logo" width={100} height={50} />
        </Link>

        {/* huddle user bar */}
        <div className="relative shadow-xl mt-[50px] w-full h-fit rounded-lg bg-[#211451] px-[14px] py-[4px]">
          <div className="-translate-y-[60%] w-full h-fit flex justify-center ">
            <Image
              className="rounded-full shadow-xl"
              width={100}
              height={100}
              src={"/assets/profileImage.svg"}
              alt="user image"
              loading="lazy"
            />
          </div>
          <header className="w-full -translate-y-[40%] flex flex-col -mt-9 items-center gap-[4px] px-8">
            <UserOnlineStatus isOnline statusText />
            <h1 className="text-[#FFFFFF] font-semibold text-center" style={{ fontSize: 'clamp(16px, 2.5vw, 21px)' }}>
              {currentUser?.first_name} {currentUser?.last_name}
            </h1>
            <p className="font-normal text-[12px] leading-[16px] text-white text-center truncate text-wrap">
            {currentUser?.email}
            </p>
          </header>
          {/* links */}
          <div className="flex flex-col w-full h-fit gap-[24px] pb-[14px]">
            {sideLinks.map((link, i) => (
              <Link key={i} href={link.url} >
                <Button
                  className="text-white w-full hover:bg-[#EEAE05] hover:text-[#fff] text-[14px] gap-2 font-normal pl-[24px] justify-start"
                  variant={"ghost"}
                >
                  <Image
                    width={20}
                    height={20}
                    alt={link.text}
                    src={`${link.icon}`}
                  />
                  <span>{link.text}</span>
                </Button>{" "}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              className="text-white w-full hover:bg-[#EEAE05] hover:text-[#fff] text-[14px] gap-2 font-normal pl-[24px] justify-start"
              variant={"ghost"}
            >
              <Image
                width={20}
                height={20}
                alt="signout image"
                src={"/assets/home.svg"}
              />
              <span>Clock out</span>
            </Button>{" "}
          </div>
        </div>

        {/* bar footer */}
        <footer className="w-full p-[14px] mx-5 flex flex-col gap-2">
          <p className="font-normal text-[14px] leading-[20px] text-[#707070]">
            Frequently used tools
          </p>
          <div className="flex flex-row items-center space-x-2">
            <Image src={pinterest} width={20} height={20} alt="pintrest"/>
            <Image src={dribble} width={20} height={20} alt="dribble"/>
            {/* <Figma />
            <Dribbble className="text-[#E94B88]" /> */}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Sidebar;
