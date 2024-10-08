import {
  IAccountsSlice,
  IBuildErrorsSlice,
  IBuildTxJSONSlice,
  INetSlice,
  IServerSlice,
  IThemeSlice,
  ITransactionsFromFirebaseSlice,
} from "@/shared/types/store/slices";

interface Store
  extends INetSlice,
    IThemeSlice,
    IAccountsSlice,
    IBuildTxJSONSlice,
    IServerSlice,
    ITransactionsFromFirebaseSlice,
    IBuildErrorsSlice {}

export default Store;
