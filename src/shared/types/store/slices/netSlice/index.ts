export interface NetState {
  net: string
}

export interface NetActions {
  setNet: (net: string) => void
}

interface INetSlice extends NetState, NetActions {}

export default INetSlice