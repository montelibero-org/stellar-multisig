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
  const [initialSeqNum, setInitialSeqNum] = useState<bigint | null>(null);

  const [tempSeqNum, setTempSeqNum] = useState<string>(
    tx.tx.seq_num ? tx.tx.seq_num.toString() : "" 
  );
  const searchParams = useSearchParams();
 
  const fetchSequenceNumber = async () => {
    try {
      const { data } = await axios.get<Information>(
        `${server}/accounts/${tx.tx.source_account}`
      );

      if (data.sequence !== undefined && /^[0-9]+$/.test(data.sequence)) {
        const sequence = BigInt(data.sequence) + BigInt(1);
        setSeqNum(sequence);
        setTempSeqNum(""); 
        setIsShowUpdateSeqNum(false);
      } else {
        setError("Sequence number is undefined or invalid.");
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

      if (data.sequence !== undefined && /^[0-9]+$/.test(data.sequence)) {
        const sequence = BigInt(tx.tx.seq_num) + BigInt(1);
        const result = isSequenceNumberOutdated(sequence, tx.tx.seq_num);
        setIsShowUpdateSeqNum(result);
      } else {
        setError("Sequence number is undefined or invalid.");
      }
    };

    if (firebaseID !== "" && tx.tx.source_account) {
      comparisonSeqs();
    }
  }, [firebaseID, tx.tx.source_account, tx.tx.seq_num]);

  useEffect(() => {
    const storedSeqNum = localStorage.getItem("initialSeqNum");
    if (storedSeqNum) {
      setInitialSeqNum(BigInt(storedSeqNum));
    } else {
      setInitialSeqNum(BigInt(tx.tx.seq_num));
      localStorage.setItem("initialSeqNum", tx.tx.seq_num.toString());
    }
    setSeqNum(tx.tx.seq_num);
    setTempSeqNum(tx.tx.seq_num.toString()); 
  }, [setSeqNum, tx.tx.seq_num]);

  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("TransactionSequenceNumber", tx.tx.seq_num.toString());
  //   window.history.replaceState({}, "", `?${params.toString()}`);
  // }, [tx.tx.seq_num]);
 
  useEffect(() => {
    if (!tx.tx.source_account) {
      setTempSeqNum(""); 
      setIsShowUpdateSeqNum(false);
    } else {
      setTempSeqNum(tx.tx.seq_num ? tx.tx.seq_num.toString() : ""); 
    }
  }, [tx.tx.seq_num, tx.tx.source_account]);

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
          value={tempSeqNum ?? ""}
          onChange={(e) => {
            const value = e.target.value.trim();
            if (/^[0-9]*$/.test(value)) {
              setTempSeqNum(value);

              if (!value) {
                setError("Sequence number is required.");
                setIsShowUpdateSeqNum(false);
                return;
              } else {
                setError("");
              }

              const newSeqNum = BigInt(value);
              setSeqNum(newSeqNum);

              if (
                initialSeqNum !== null &&
                newSeqNum !== initialSeqNum &&
                isSequenceNumberOutdated(newSeqNum, tx.tx.seq_num)
              ) {
                setIsShowUpdateSeqNum(true);
              } else {
                setIsShowUpdateSeqNum(false);
              }
            }
          }}
          onBlur={() => {
            if (!tempSeqNum) {
              setError("Sequence number is required.");
            }
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
        The transaction sequence number is usually one higher than the current
        account sequence number.
      </p>
      {isShowUpdateSeqNum && (
        <p className="warning">
          The sequence number is outdated. Please update it.
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SequenceNumberInput;
