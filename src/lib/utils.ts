import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const secondsDifference = timeDifference / 1000;

  if (secondsDifference < 60) {
    return `${Math.floor(secondsDifference)} seconds ago`;
  } else if (secondsDifference < 3600) {
    const minutes = Math.floor(secondsDifference / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (secondsDifference < 86400) {
    const hours = Math.floor(secondsDifference / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(secondsDifference / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
