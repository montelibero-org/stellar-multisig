"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { useSearchParams } from "next/navigation";

const BaseFeeInput: FC = () => {
  const { tx, setFee } = useStore(useShallow((state) => state));
  const searchParams = useSearchParams();

  const initialBaseFee = Number(searchParams.get("baseFee")) || tx.tx.fee || "";
  const [feeState, setfeeState] = useState(initialBaseFee);

  useEffect(() => {
    if (typeof feeState === "number" && feeState) {
      setFee(feeState);
    }
  }, [feeState]);
  useEffect(() => {
    setfeeState(tx.tx.fee!);
  }, [tx.tx.fee]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("baseFee", feeState.toString());

    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [feeState]);
  return (
    <div>
      <h4>Base Fee</h4>
      <input
        placeholder="Amount in stroops"
        value={feeState === 0 ? "" : feeState}
        onChange={(e) => setfeeState(Number(e.target.value))}
      />
      <p>
        The base inclusion fee is currently set to 100 stroops (0.00001 lumens).
        For real-time fee stats, see{" "}
        <a
          href="https://developers.stellar.org/docs/data-and-data-structures/fees/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fee Statistics
        </a>
        .
      </p>
    </div>
  );
};

export default BaseFeeInput;
