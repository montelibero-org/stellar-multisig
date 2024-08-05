import { IThemeSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";

export const themeSlice: StateCreator<
  IThemeSlice,
  [["zustand/immer", never]],
  [],
  IThemeSlice
> = (set/*, get*/) => ({
  theme: typeof localStorage !== "undefined" ? localStorage.getItem("theme") || "night" : "night",
  setTheme: (theme: string) => {
    set({ theme: theme });
    typeof localStorage !== "undefined" && localStorage.setItem("theme", theme);
  },
});
