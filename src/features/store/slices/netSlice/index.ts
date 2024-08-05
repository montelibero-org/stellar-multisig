import { INetSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";

export const netSlice: StateCreator<
  INetSlice,
  [["zustand/immer", never]],
  [],
  INetSlice
> = (set/*, get*/) => ({
  net: typeof localStorage !== "undefined" ? localStorage.getItem("net") || "public" : "public",
  setNet: (net: string) => {
    set({ net: net });
    typeof localStorage !== "undefined" && localStorage.setItem("net", net);
  },
});
