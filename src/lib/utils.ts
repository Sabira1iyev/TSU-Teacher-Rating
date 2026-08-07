import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRating(rating: number): string {
  if (rating == null) return "0.0";
  return rating.toFixed(1);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.0) return "text-primary";
  if (rating >= 2.5) return "text-amber";
  return "text-red";
}

export function getRatingBarColor(rating: number): string {
  if (rating >= 4.0) return "#0060a9";
  if (rating >= 2.5) return "#d4a017";
  return "#dc2626";
}
