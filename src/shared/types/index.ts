// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export { type default as Store } from "./store";
export type { INetSlice, IThemeSlice, IAccountsSlice, IAccount } from "@/shared/types/store/slices";
export type {
    Information,
    Issuer,
    Signer,
    Balance,
    TomlInfo,
    Entry
} from "@/shared/types/information";
export type {CurrencyInfo, RecordEnemy} from "@/shared/types/currencyInfo";
export type DocumentInfo = {
  [key: string]: string;
}