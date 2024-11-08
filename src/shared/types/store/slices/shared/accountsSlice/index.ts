export type IAccount = {
  id: string
  accountID: string
  isMultiSig: boolean
  isCurrent: boolean
  net: string
}

export interface AccountState {
  accounts: IAccount[]
  isAuth: boolean
  currentAccount: IAccount | null
  isOpenAddAccountModal: boolean;
}

export interface AccountActions {
  setAccounts: (Accounts: IAccount[]) => void
  setIsAuth: (isAuth: boolean) => void
}

interface IAccountsSlice extends AccountState, AccountActions {}

export default IAccountsSlice
