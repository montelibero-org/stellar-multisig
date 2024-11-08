import {
  IAccountsSlice,
  IBuildErrorsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
  ITransactionsFromFirebaseSlice,
  ICollapsesBlocksSlice,
  IInformationSlice,
  IModalsSlice,
  IFirebaseSettingsSlice,
} from "./slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice,
    ITransactionsFromFirebaseSlice,
    IBuildErrorsSlice,
    ICollapsesBlocksSlice,
    IInformationSlice,
    ICollapsesBlocksSlice,
    IModalsSlice,
    IFirebaseSettingsSlice {}

export default Store;
