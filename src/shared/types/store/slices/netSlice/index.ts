export type NetState = {
  net: string
}

export type NetActions = {
  setNet: (net: string) => void
}

export interface INetSlice extends NetState, NetActions {}