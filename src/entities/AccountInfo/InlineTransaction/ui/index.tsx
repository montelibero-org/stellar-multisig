import React, { FC } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { TransactionStatuses } from "@/views/account/AccountInfo";
import {
  DecodedTransaction,
  ISeqNumIsStale,
  TransactionData,
} from "@/shared/types";
import Link from "next/link";

interface Props {
  decodedTransaction: DecodedTransaction;
  seqNumsIsStales: ISeqNumIsStale[];
  index: number;
  transactionsFromFirebase: TransactionData[];
  isStale: boolean;
}

interface TransactionLinkProps {
  transactionLink: string;
  type: string | number | undefined;
}

const TransactionLink: FC<TransactionLinkProps> = ({
  transactionLink,
  type,
}) => (
  <Link href={transactionLink} target="_blank" rel="noreferrer noopener">
    {type}
  </Link>
);

const InlineTransaction: FC<Props> = ({
  decodedTransaction,
  seqNumsIsStales,
  index,
  transactionsFromFirebase,
  isStale,
}) => {
  const { net } = useStore(useShallow((state) => state));
  const transactionLink = `/${net}/build-transaction?firebaseID=${transactionsFromFirebase[index]?.id}`;

  return (
    <tr>
      {isStale ? (
        <td></td>
      ) : (
        <td>
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
            <i
              className="fa-solid fa-arrow-rotate-right"
              style={{
                color: "#0691b7",
                cursor: "pointer",
              }}
              title="Click to update sequence number"
            ></i>
          </Link>
        </td>
      )}
      <td>
        <TransactionLink
          transactionLink={transactionLink}
          type={decodedTransaction?.transaction.operations[0].type}
        />
      </td>
      <td>
        <TransactionLink
          transactionLink={transactionLink}
          type={decodedTransaction?.transaction.signatures.length}
        />
      </td>
      <td>
        <TransactionLink
          transactionLink={transactionLink}
          type={TransactionStatuses.signing}
        />
      </td>
    </tr>
  );
};

export default InlineTransaction;
