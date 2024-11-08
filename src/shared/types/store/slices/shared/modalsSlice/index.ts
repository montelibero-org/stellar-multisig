export interface ModalsState {
  isOpenAddAccountModal: boolean
  isOpenFirebaseSettingsModal: boolean
}

export interface ModalsActions {
  setIsOpenAddAccountModal: (condition: boolean) => void
  setIsOpenFirebaseSettingsModal: (conditionl: boolean) => void
}

interface IModalsSlice extends ModalsState, ModalsActions {}

export default IModalsSlice
