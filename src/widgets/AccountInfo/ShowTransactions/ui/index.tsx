import React, { FC } from "react";
import { InlineTransaction } from "@/entities";
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
}

const ShowTransactions: FC<Props> = ({
  decodedTransactions,
  seqNumsIsStales,
  transactionsFromFirebase,
}) => {
  const { collapsesBlocks, setCollapsesBlocks } = useStore(
    useShallow((state) => state)
  );
  
  if (!decodedTransactions) return null;

  const indices = decodedTransactions.map((_, index) => index);

  indices.sort((a, b) => {
    return (
      transactionsFromFirebase[b].createdAt -
      transactionsFromFirebase[a].createdAt
    );
  });

  return (
    <>
      <h2 style={{ marginBottom: "-10px", marginTop: "20px" }}>
        Transactions to Sign
      </h2>
      <div className="tabs space inline-right">
        <div className="tabs-body">
          <div className="relative segment blank">
            <table className="table exportable" style={{ width: "100%" }}>
              <thead style={{ width: "100%" }}>
                <tr style={{ position: "relative" }}>
                  <th style={{ display: "none" }}>ID</th>
                  <th>Transaction</th>
                  <th>
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
                        right: "10px",
                        top: "12px",
                      }}
                    />
                  </th>
                </tr>
              </thead>
              <tbody style={{ width: "100%" }}>
                {decodedTransactions !== null &&
                decodedTransactions.length > 0 &&
                collapsesBlocks.transactions ? (
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
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      style={{ textAlign: "center", padding: "10px" }}
                    >
                      No transactions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowTransactions;
