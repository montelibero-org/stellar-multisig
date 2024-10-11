import { useStore } from "@/shared/store";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { TransactionStatuses } from "@/views/account/AccountInfo";
import {
  DecodedTransaction,
  ISeqNumIsStale,
  TransactionData,
} from "@/shared/types";

interface Props {
  decodedTransaction: DecodedTransaction;
  seqNumsIsStales: ISeqNumIsStale[];
  index: number;
  transactionsFromFirebase: TransactionData[];
  isStale: boolean;
}

const InlineTransaction: FC<Props> = ({
  decodedTransaction,
  seqNumsIsStales,
  index,
  transactionsFromFirebase,
  isStale
}) => {
  const { net } = useStore(useShallow((state) => state));
  return (
    <tr >
      <td colSpan={2} style={{padding: "10px"}}>
        <span style={{ display: "none" }}>
          {decodedTransaction?.transaction &&
            Buffer.from(decodedTransaction?.transaction?.hash()).toString(
              "hex"
            )}
        </span>
        <Link
          href={
            decodedTransaction?.index &&
            !seqNumsIsStales[decodedTransaction?.index]?.isStale
              ? `/${net}/build-transaction?firebaseID=${transactionsFromFirebase[index]?.id}&isStale=true`
              : `/${net}/build-transaction?firebaseID=${transactionsFromFirebase[index]?.id}`
          }
          target="_blank"
          rel="noreferrer noopener"
        >
          {isStale ? (
            <></>
          ) : (
            <span
              style={{
                color: "#0691b7",
                cursor: "pointer",
              }}
              title="Click to update sequence number"
            >
              <i className="fa-solid fa-arrow-rotate-right"></i>{" "}
            </span>
          )}
          Operation type: {decodedTransaction?.transaction.operations[0].type};{" "}
          <span>
            Signatures: {decodedTransaction?.transaction.signatures.length};{" "}
          </span>
          <span>Status: {TransactionStatuses.signing}</span>
        </Link>
      </td>
    </tr>
  );
};

export default InlineTransaction;
