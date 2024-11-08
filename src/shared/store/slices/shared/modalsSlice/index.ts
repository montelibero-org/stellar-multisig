import { IModalsSlice } from "@/shared/types/index";
import { StateCreator } from "zustand";

const modalsSlice: StateCreator<
  IModalsSlice,
  [["zustand/immer", never]],
  [],
  IModalsSlice
> = (set/*, get*/) => {
  const isOpenAddAccountModal = false;
  const isOpenFirebaseSettingsModal = false;

  const setIsOpenAddAccountModal = (condition: boolean) => {
    set({ isOpenAddAccountModal: condition });
  };

  const setIsOpenFirebaseSettingsModal = (conditionl: boolean) => {
    set({ isOpenFirebaseSettingsModal: conditionl });
  };

  return {
    isOpenAddAccountModal,
    isOpenFirebaseSettingsModal,
    setIsOpenAddAccountModal,
    setIsOpenFirebaseSettingsModal
  };
};

export default modalsSlice
