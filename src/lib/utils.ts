import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import TurndownService from "turndown";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function escapeCHX(input: string){
  return input.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

export function htmlToMarkdown(input: string){
  const turndownService = new TurndownService();
  return turndownService.turndown(input);


}