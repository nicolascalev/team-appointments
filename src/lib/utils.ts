import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function formatDateLong(date: Date) {
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function getDurationInMinutes(
  amount: number,
  unit: "minutes" | "hours" | "days"
) {
  switch (unit) {
    case "minutes":
      return amount;
    case "hours":
      return amount * 60;
    case "days":
      return amount * 24 * 60;
    default:
      return amount;
  }
}

const cmsBaseUrl =
  process.env.NEXT_PUBLIC_CMS_BASE_URL || "https://teamlypro-cms.vercel.app";
export function getCmsImageUrl(url: string) {
  return `${cmsBaseUrl}${url}`;
}