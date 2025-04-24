import { LayoutDashboard, WorkflowIcon, Group, Star, Joystick, LogOut } from 'lucide-react';
import { StatsCardProps, TaskTodayProps, TopRanksProps } from "../lib/@types";


export const sideLinks = [
  {
    url: "/dashboard",
    text: "Your dashboard",
    icon: "/assets/home.svg",
  },
  {
    url: "/workroom",
    text: "Workroom",
    icon: "/assets/workroom.svg",
  },
  {
    url: "/friends",
    text: "Friends",
    icon: "/assets/friends.svg",
  },
  {
    url: "/leaderboards",
    text: "Leaderboards",
    icon: "/assets/leaderboards.svg",
  },
  {
    url: "/your-tasks",
    text: "Your tasks",
    icon: "/assets/your-task.svg",
  },
  // {
  //   url: "/",
  //   text: "Clock out",
  //   icon: "/assets/home.svg",
  // },
];
export const statsCardsData: StatsCardProps[] = [
  {
    image: "/assets/leader.svg",
    title: "Leader",
    description: "2hr per task",
    progressValue: 60,
    progressColor: '#F18D4B'
  },
  {
    image: "/assets/teamplayer.svg",
    title: "Team Player",
    description: "10/50 Drop-ins this week",
    progressValue: 20,
    progressColor: '#6FAEFC'
  },
  {
    image: "/assets/workaholic.svg",
    title: "Workaholic",
    description: "2hr per task",
    progressValue: 80,
    progressColor: '#ADD359'
  },
  {
    image: "/assets/slacker.svg",
    title: "Slacker",
    description: "2hr per task",
    progressValue: 60,
    progressColor: '#DE6EC6'
  }
];

export const tasksData: TaskTodayProps[] = [
  {
    title: "Create UI Screens for multiple components",
    time: "8:00am",
    points: 10,
  },
  {
    title: "Fix bugs in the authentication module",
    time: "9:00am",
    points: 8,
  },
  {
    title: "Optimize database queries",
    time: "10:30am",
    points: 15,
  },
  {
    title: "Write unit tests for new features",
    time: "12:00pm",
    points: 12,
  },
  {
    title: "Update project documentation",
    time: "1:00pm",
    points: 5,
  },
  {
    title: "Code review and merge pull requests",
    time: "3:00pm",
    points: 7,
  },
];

export const topRanksData: TopRanksProps[] = [
  {
    rank: 1,
    name: "Gregory Michael",
    tools: "Photoshop | Figma | VS Code",
    timeSpent: "10 hrs :30m",
  },
  {
    rank: 2,
    name: "Sophia Johnson",
    tools: "Illustrator | Sketch | WebStorm",
    timeSpent: "9 hrs :15m",
  },
  {
    rank: 3,
    name: "Michael Brown",
    tools: "After Effects | Figma | Sublime Text",
    timeSpent: "8 hrs :50m",
  },
  {
    rank: 4,
    name: "Emily Davis",
    tools: "Premiere Pro | Figma | Atom",
    timeSpent: "7 hrs :45m",
  },
  {
    rank: 5,
    name: "James Wilson",
    tools: "Lightroom | Figma | Brackets",
    timeSpent: "7 hrs :30m",
  },
  {
    rank: 6,
    name: "Olivia Martinez",
    tools: "InDesign | Figma | Notepad++",
    timeSpent: "6 hrs :20m",
  },
];