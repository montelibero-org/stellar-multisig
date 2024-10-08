import { Transaction } from "stellar-sdk";

export type DecodedTransaction = {
  index: number;
  transaction: Transaction;
} | null;
export type DecodedTransactions = DecodedTransaction[] | null;

export default DecodedTransaction;
