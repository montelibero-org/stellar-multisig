import { BuildErrors, IBuildErrorsSlice } from "@/shared/types";
import { StateCreator } from "zustand";

export const buildErrorsSlice: StateCreator<
  IBuildErrorsSlice,
  [["zustand/immer", never]],
  [],
  IBuildErrorsSlice
> = (set/*, get*/) => ({
  buildErrors: [],
  setBuildErrors: (update: (prevErrors: BuildErrors) => BuildErrors) => {
    set((state) => ({
      buildErrors: update(state.buildErrors),
    }));
  },
});
