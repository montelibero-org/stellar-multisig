import { Networks } from "stellar-sdk"
import { Net } from "../.."

export type Server = "https://horizon-testnet.stellar.org" | "https://horizon.stellar.org"

export interface ServerState {
  server: Server
  network: Networks
}

export interface ServerActions {
  setServer: (server: Net) => void
  setNetwork: (network: Net) => void
}

interface IServerSlice extends ServerState, ServerActions {}

export default IServerSlice
