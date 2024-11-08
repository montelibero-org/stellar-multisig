"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import axios from "axios";
import { Information } from "@/shared/types";
import { useShallow } from "zustand/react/shallow";
import { isSequenceNumberOutdated } from "@/shared/helpers";
import { useSearchParams } from "next/navigation";

type Props = {
  firebaseID: string;
};

const SequenceNumberInput: FC<Props> = ({ firebaseID }) => {
  const { tx, setSeqNum, server } = useStore(useShallow((state) => state));
  const [error, setError] = useState<string>("");
  const [isShowUpdateSeqNum, setIsShowUpdateSeqNum] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const fetchSequenceNumber = async () => {
    try {
      const { data } = await axios.get<Information>(
        `${server}/accounts/${tx.tx.source_account}`
      );
      if (data.sequence !== undefined) {
        const sequence = BigInt(data.sequence) + BigInt(1);
        setSeqNum(sequence);
      } else {
        setError("Sequence number is undefined.");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("Account not found or not funded.");
      }
    }
  };

  useEffect(() => {
    const comparisonSeqs = async () => {
      const { data } = await axios.get<Information>(
        `https://horizon.stellar.org/accounts/${tx.tx.source_account}`
      );
      if (data.sequence !== undefined) {
        const sequence = BigInt(tx.tx.seq_num) + BigInt(1);
        const result = isSequenceNumberOutdated(sequence, tx.tx.seq_num);
        setIsShowUpdateSeqNum(result);
      } else {
        setError("Sequence number is undefined.");
      }
    };
    if (firebaseID !== "" && tx.tx.source_account) {
      comparisonSeqs();
    }
  }, [firebaseID, tx.tx.source_account, tx.tx.seq_num]);
  useEffect(() => {
    setSeqNum(tx.tx.seq_num);
  }, [setSeqNum]);
  useEffect(() => {



    const params = new URLSearchParams(searchParams.toString());
    params.set("TransactionSequenceNumber", tx.tx.seq_num.toString());



    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [tx.tx.seq_num]);
  return (
    <div>
      <h4>Transaction Sequence Number</h4>
      <div style={{ display: "flex" }}>
        {isShowUpdateSeqNum && (
          <span
            style={{
              color: "#0691b7",
              marginTop: "8px",
            }}
            title="Click to update sequence number"
          >
            <i className="fa-solid fa-arrow-rotate-right"></i>{" "}
          </span>
        )}
        <input
          placeholder="Ex: 559234806710273"
          value={tx.tx.seq_num?.toString() || ""}
          onChange={(e) => {
            const value = e.target.value;
            setSeqNum(value ? BigInt(value) : BigInt(0));
          }}
        />
        {tx.tx.source_account && (
          <button
            style={{ paddingRight: "50px" }}
            onClick={fetchSequenceNumber}
          >
            Fetch next sequence{" "}
          </button>
        )}
      </div>
      <p>
        The transaction sequence number is usually one higher than current
        account sequence number.
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SequenceNumberInput;
