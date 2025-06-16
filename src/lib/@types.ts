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

export interface IMember {
  id: string; // Typically a UUID string
  created_at: string; // ISO 8601 date string, e.g., "2025-06-14T12:47:57.475Z"
  updated_at: string; // ISO 8601 date string
  auth_provider: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string; // Sensitive, handle with care (often not returned to frontend)
  role: string;
  xp: number;
  level: number;
  avatar_url?: string; // Optional, as it might not always be present
  is_verified: boolean;
  is_user_onboarded: boolean;
  productivity: number;
  average_task_time: number;
  user_type: string;
  find_us: string;
  daily_active_minutes: number;
  teamwork_collaborations: number;
  software_used: string[]; // Array of strings
}
