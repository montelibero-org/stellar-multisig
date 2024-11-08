"use client";

import React, { FC } from "react";
import { InlineTransaction, TransactionIcon } from "@/entities";
import {
  DecodedTransactions,
  ISeqNumIsStale,
  TransactionData,
} from "@/shared/types";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/shared/store";
import { IsShowedBlock } from "@/shared/widgets";

interface Props {
  decodedTransactions: DecodedTransactions;
  seqNumsIsStales: ISeqNumIsStale[];
  transactionsFromFirebase: TransactionData[];
  isVisibleBuildTx: boolean;
  ID: string;
}

export type Signer = {
  weight: number;
};

const ShowTransactions: FC<Props> = ({
  decodedTransactions,
  seqNumsIsStales,
  transactionsFromFirebase,
  isVisibleBuildTx,
  ID,
}) => {
  const { collapsesBlocks, setCollapsesBlocks } = useStore(
    useShallow((state) => state)
  );

  const indices = decodedTransactions?.map((_, index) => index);
  if (indices) {
    indices.sort((a, b) => {
      return (
        transactionsFromFirebase[b].createdAt -
        transactionsFromFirebase[a].createdAt
      );
    });
  }

  return (
    isVisibleBuildTx && (
      <div className="tabs space inline-right">
        <div className="tabs-body">
          <div
            style={{ position: "relative" }}
            className="relative segment blank"
          >
            <h3 style={{ margin: "0" }}>Transactions to Sign</h3>
            {decodedTransactions !== null &&
              decodedTransactions.length > 0 &&
              collapsesBlocks.transactions &&
              isVisibleBuildTx && <hr className="flare"></hr>}
            <TransactionIcon
              ID={ID}
              isVisible={isVisibleBuildTx}
              typeIcon="Add"
              style={{
                position: "absolute",
                right: "70px",
                top: "22px",
                scale: "1.1",
              }}
            />
            <IsShowedBlock
              condition={collapsesBlocks.transactions}
              onToggle={() =>
                setCollapsesBlocks({
                  ...collapsesBlocks,
                  transactions: !collapsesBlocks.transactions,
                })
              }
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "33px",
                top: "26px",
                scale: "1.1",
              }}
              title="Transactions"
            />
            {decodedTransactions !== null &&
            decodedTransactions.length > 0 &&
            collapsesBlocks.transactions &&
            isVisibleBuildTx ? (
              <table
                className="table exportable"
                style={{ position: "relative" }}
              >
                <thead>
                  <tr>
                    <th className="collapsing">Stale</th>
                    <th className="collapsing">Operation type</th>
                    <th className="collapsing">Signatures</th>
                    <th className="collapsing">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {indices &&
                    indices
                      .filter((index) => decodedTransactions[index] !== null)
                      .map((index) => (
                        <InlineTransaction
                          key={index}
                          index={index}
                          decodedTransaction={decodedTransactions[index]}
                          seqNumsIsStales={seqNumsIsStales}
                          transactionsFromFirebase={transactionsFromFirebase}
                          isStale={seqNumsIsStales[index]?.isStale}
                        />
                      ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </div>
    )
  );
};

export default ShowTransactions;
