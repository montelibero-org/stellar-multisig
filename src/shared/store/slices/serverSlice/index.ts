import { IServerSlice, Server } from "@/shared/types/index";
import { Net } from "@/shared/types/store/slices/netSlice";
import { Networks } from "stellar-sdk";
import { StateCreator } from "zustand";

export const serverSlice: StateCreator<
  IServerSlice,
  [["zustand/immer", never]],
  [],
  IServerSlice
> = (set/*, get*/) => {
  const server: Server = "https://horizon.stellar.org";
  const network: Networks = Networks.PUBLIC;
  
  const setServer = (net: Net) => {
    set({
      server:
        net === "public"
          ? "https://horizon.stellar.org"
          : "https://horizon-testnet.stellar.org",
    });
  };

  const setNetwork = (net: Net) => {
    set({ network: net === "public" ? Networks.PUBLIC : Networks.TESTNET });
  };

  return {
    server,
    network,
    setServer,
    setNetwork,
  };
};
