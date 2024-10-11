export type IAccount = {
  id: string
  accountID: string
  isMultiSig: boolean
  isCurrent: boolean
  net: string
}

export interface AccountState {
  accounts: IAccount[]
  isOpenAddAccountModal: boolean
  isAuth: boolean
  currentAccount: IAccount | null
}

export interface AccountActions {
  setAccounts: (Accounts: IAccount[]) => void
  setIsOpenAddAccountModal: (isOpenAddAccountModal: boolean) => void
  setIsAuth: (isAuth: boolean) => void
}

interface IAccountsSlice extends AccountState, AccountActions {}

export default IAccountsSlice