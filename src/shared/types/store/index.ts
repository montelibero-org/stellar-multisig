import {
  IAccountsSlice,
  IBuildErrorsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
  ITransactionsFromFirebaseSlice,
  ICollapsesBlocksSlice
} from "./slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice,
    ITransactionsFromFirebaseSlice,
    IBuildErrorsSlice,
    ICollapsesBlocksSlice {}

export default Store;
