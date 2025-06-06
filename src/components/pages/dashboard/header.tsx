import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import NavigationLink from "@/components/basics/Navigation-link";

interface HeaderProps {
  name: string;
  isInWorkroom: boolean;
  teamName: string;
  companyName: string;
}
const users = [
  {
    id: 1,
    name: "Emily Harris",
    avatar: "/assets/profileImage.svg",
    fallback: "EH",
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "/assets/profileImage.svg",
    fallback: "JD",
  },
  {
    id: 3,
    name: "Jane Smith",
    avatar: "/assets/profileImage.svg",
    fallback: "JS",
  },
];
const Header: React.FC<HeaderProps> = ({
  name,
  isInWorkroom,
  teamName,
  companyName,
}) => {
  return (
    <header>
      <Card
        className={`border-0 p-0 bg-transparent  flex flex-col md:flex-row items-end ${
          !isInWorkroom ? "justify-between gap-0" : "justify-start gap-10"
        } shadow-none`}
      >
        <CardHeader className="p-0">
          <SubHeading
            className={`text-custom-semiBlack ${
              isInWorkroom ? "font-bold" : "font-semibold"
            }`}
          >
            {!isInWorkroom ? formatDate() : companyName}
          </SubHeading>
          {!isInWorkroom ? (
            <MainHeading className="text-custom-semiBlack font-light">
              Welcome, <span className="font-semibold">{name}</span>
            </MainHeading>
          ) : (
            <h1 className="text-3xl text-custom-semiBlack font-semibold">
              {teamName}
            </h1>
          )}
        </CardHeader>
        <CardContent className="flex gap-4 p-0">
          {!isInWorkroom ? (
            <>
              <div className="flex flex-col p-0 items-end text-custom-semiBlack">
                <div className="flex">
                  {users.map((user) => (
                    <TooltipProvider key={user.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Avatar className="w-[clamp(1rem,_0.6838vw,_1.5rem)] h-[clamp(1rem,_0.6838vh,_1.5rem)]">
                            <AvatarImage
                              src={user.avatar}
                              loading="lazy"
                              alt="profile"
                            />
                            <AvatarFallback>{user.fallback}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{user.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                <p className="text-xs">Your team mates are waiting for you</p>
              </div>
              <NavigationLink
                className="bg-[#956FD6] text-xl shadow-md"
                href="/workroom/create"
                icon={{
                  icon_component: <Globe size={10} />,
                  icon_position: "right",
                }}
              >
                Create workroom
              </NavigationLink>
            </>
          ) : (
            <p className="text-sm font-semibold text-custom-semiBlack">
              {formatDate()}
            </p>
          )}
        </CardContent>
      </Card>
    </header>
  );
};

export default Header;
