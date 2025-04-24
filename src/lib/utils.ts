import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = () => {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  const getOrdinal = (num: number) => {
    const s = ["th", "st", "nd", "rd"],
      v = num % 100;
    return num + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${dayOfWeek} ${getOrdinal(dayOfMonth)} ${month}`;
};

export function generateUniqueKey(token: string) {
  let _id: string;
  // Generate a unique key using a combination of the token and some Math functions
  _id = `_id_${token.slice(0, 3)}-sqidcd${token.slice(
    2,
    token.length - 2
  )}--v${Math.round(Math.random() * 100)}`;

  // getting back the generated unique id
  return { _id };
}
