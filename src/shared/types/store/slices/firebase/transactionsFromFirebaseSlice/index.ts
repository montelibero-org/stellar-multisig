import { TransactionData } from "@/shared/types/firebase";

export interface ITransactionsFromFirebaseState {
  transactionsFromFirebase: TransactionData[]
}

export interface ITransactionsFromFirebaseActions {
  setTransactionsFromFirebase: (transactionsFromFirebase: TransactionData[]) => void
}

interface ITransactionsFromFirebaseSlice extends ITransactionsFromFirebaseState, ITransactionsFromFirebaseActions {}

export default ITransactionsFromFirebaseSlice
