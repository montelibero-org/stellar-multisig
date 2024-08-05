import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn: (...inputs: string[]) => string = (...inputs) => {
  return twMerge(clsx(inputs))
}