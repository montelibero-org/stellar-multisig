// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export { type default as Store } from "./store";
export type { INetSlice, IThemeSlice } from "@/shared/types/store/slices";
export type {
    Information,
    Issuer,
    Signer,
    Balance,
    TomlInfo,
    Entry
} from "@/shared/types/information";
export type DocumentInfo = {
  [key: string]: string;
}