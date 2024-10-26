import { IInformationSlice, Information } from "@/shared/types";
import { StateCreator } from "zustand";

const informationSlice: StateCreator<
  IInformationSlice,
  [["zustand/immer", never]],
  [],
  IInformationSlice
> = (set /*, get*/) => {
  const information: Information = {} as Information;

  const setInformation = (information: Information) => {
    set({ information: information });
  }

  return {
    information,
    setInformation,
  };
};

export default informationSlice;
