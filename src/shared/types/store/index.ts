import { IAccountsSlice, INetSlice, IThemeSlice } from "@/shared/types/store/slices";

interface Store extends INetSlice, IThemeSlice, IAccountsSlice {}

export default Store;