import { IAccountsSlice, IAccount } from "@/shared/types";
import { StateCreator } from "zustand";

const accountSlice: StateCreator<
  IAccountsSlice,
  [["zustand/immer", never]],
  [],
  IAccountsSlice
> = (set/*, get*/) => {
  const accounts: IAccount[] = [];
  const isOpenAddAccountModal = false;
  const currentAccount = null
  const isAuth = false

  const setIsAuth = (isAuth: boolean) => {
    set({ isAuth: isAuth });
  };

  const setAccounts = (accounts: IAccount[]) => {
    set({ accounts: accounts });
    localStorage.setItem("accounts", JSON.stringify(accounts));
  };

  const setIsOpenAddAccountModal = (isOpenAddAccountModal: boolean) => {
    set({ isOpenAddAccountModal: isOpenAddAccountModal });
  };


  return {
    accounts,
    setAccounts,
    isOpenAddAccountModal,
    setIsOpenAddAccountModal,
    isAuth,
    currentAccount,
    setIsAuth
  };
};

export default accountSlice;
