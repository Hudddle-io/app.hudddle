import { Task } from "@/app/(tasks)/your-tasks/my-task";
import { LucideIcon } from "lucide-react";
import { StaticImageData } from "next/image";

export interface SidebarItem {
  icon: React.ComponentType;
  href: string;
  label: string;
}

export interface SidebarProps {
  name: string;
  email: string;
  online?: boolean;
}

export interface StatsCardProps {
  image: string;
  title: string;
  description: string;
  progressValue: number;
  progressColor: string;
}

export interface TimeLogCardContentProps {
  description: string;
  icon?: string;
  value: string;
  border?: string;
}

export interface TaskTodayProps extends Task {
  title: string;
  time: string;
  points: number;
}

export interface LeaderBoardHeaderProps {
  companyName: string;
  teamName: string;
  points: number;
  totalHours: string;
}

export interface TopRanksProps {
  rank: number;
  name: string;
  tools: string;
  timeSpent: string;
}
