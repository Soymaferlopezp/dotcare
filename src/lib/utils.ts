import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases al estilo shadcn */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
