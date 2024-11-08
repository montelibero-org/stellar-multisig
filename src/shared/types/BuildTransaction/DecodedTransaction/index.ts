import { Transaction } from "stellar-sdk";

// Определение типа Signer
export type Signer = {
  weight: number; // Вес подписанта
};

// Определение типа DecodedTransaction
export type DecodedTransaction = {
  index: number; // Индекс транзакции
  transaction: Transaction; // Сама транзакция из stellar-sdk
  signers?: Signer[]; // Массив подписантов
} | null;

// Определение типа DecodedTransactions
export type DecodedTransactions = DecodedTransaction[] | null;

// Определение типа для других данных (если необходимо)
export type ISeqNumIsStale = {
  isStale: boolean; // Статус актуальности
};

export type TransactionData = {
  createdAt: number; // Время создания транзакции
  // Другие поля, если нужно
};