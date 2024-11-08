export interface NetState {
  net: "public" | "testnet"
}

export type Net = "public" | "testnet"

export interface NetActions {
  setNet: (net: "public" | "testnet") => void
}

interface INetSlice extends NetState, NetActions {}

export default INetSlice
