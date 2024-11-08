import { INetSlice } from "@/shared/types/index";
import { StateCreator } from "zustand";

const netSlice: StateCreator<
  INetSlice,
  [["zustand/immer", never]],
  [],
  INetSlice
> = (set/*, get*/) => {
  const net = "public";
  const setNet = (net: "public" | "testnet") => {
    set({ net: net });
    localStorage.setItem("net", net);
  }

  return {
    net,
    setNet
  };
};

export default netSlice
