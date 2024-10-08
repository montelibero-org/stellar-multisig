import React, { FC } from "react";
import { InlineTransaction } from "@/entities";
import TransactionsSort from "@/features/AccountInfo/TransactionsSort";
import { DecodedTransactions, ISeqNumIsStale, TransactionData } from "@/shared/types";

interface Props {
  ID: string;
  decodedTransactions: DecodedTransactions;
  setDecodedTransactions: (value: DecodedTransactions) => void;
  seqNumsIsStales: ISeqNumIsStale[];
  transactionsFromFirebase: TransactionData[];
  setTransactionsFromFirebase: (value: TransactionData[]) => void;
}

const ShowTransactions: FC<Props> = ({
  ID,
  decodedTransactions,
  setDecodedTransactions,
  seqNumsIsStales,
  transactionsFromFirebase,
  setTransactionsFromFirebase
}) => {
  return (
    <div className="tabs space inline-right">
      <div className="tabs-header">
        <div>
          <a href="#" className="tabs-item condensed selected">
            <span className="tabs-item-text selected">
              Transactions for sign
            </span>
          </a>
        </div>
      </div>
      <hr className="flare" />
      <div className="tabs-body">
        <div className="relative segment blank">
          <TransactionsSort
            ID={ID}
            showedTransactions={decodedTransactions}
            setShowedTransactions={setDecodedTransactions}
            transactionsFromFirebase={transactionsFromFirebase}
            setTransactionFromFirebase={setTransactionsFromFirebase}
          />
          <table className="table exportable" style={{ width: "100%" }}>
            <thead style={{ width: "100%" }}>
              <tr>
                <th style={{ display: "none" }}>ID</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody style={{ width: "100%" }}>
              {decodedTransactions !== null && decodedTransactions.length > 0 ? (
                decodedTransactions
                  .filter(transaction => transaction !== null)
                  .map((decodedTransaction, index) => (
                    <InlineTransaction
                      key={index}
                      index={index}
                      decodedTransaction={decodedTransaction}
                      seqNumsIsStales={seqNumsIsStales}
                      transactionsFromFirebase={transactionsFromFirebase}
                      isStale={seqNumsIsStales[index]?.isStale}
                    />
                  ))
              ) : (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", padding: "10px" }}>
                    No transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShowTransactions;
