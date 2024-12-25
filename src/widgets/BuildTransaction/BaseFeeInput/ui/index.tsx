"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { useSearchParams } from "next/navigation";

const BaseFeeInput: FC = () => {
  const { tx, setFee } = useStore(useShallow((state) => state));
  const searchParams = useSearchParams();

  const initialBaseFee = (() => {
    const feeFromParams = parseFloat(searchParams.get("baseFee") || "");
    if (!isNaN(feeFromParams) && isFinite(feeFromParams) && feeFromParams > 0) {
      return feeFromParams;
    } else if (tx.tx.fee) {
      return tx.tx.fee;
    } else {
      return 100;
    }
  })();

  const [sourceError, setSourceError] = useState<string>("");

  const validateFee = (value: number) => {
    if (value <= 0) {
      setSourceError("Base Fee is required");
    }else {
      setSourceError(""); 
    }
  }


  const [feeState, setFeeState] = useState<number>(initialBaseFee);


  useEffect(() => {
    if (feeState !== tx.tx.fee && !isNaN(feeState) && isFinite(feeState)) {
      setFee(feeState);
    }
  }, [feeState, tx.tx.fee]);

  useEffect(() => {
    if (feeState !== tx.tx.fee && tx.tx.fee != null) {
      setFeeState(tx.tx.fee!);
    }
  }, [tx.tx.fee]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("baseFee", feeState.toString());
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [feeState]);
  useEffect(() => {
    validateFee(feeState); 
  }, [feeState]);
  return (
    <div>
      <h4>Base Fee</h4>
      <input
        placeholder="Amount in stroops"
        value={feeState || ""}
        onChange={(e) => {
          
          if (e && e.target) {
            const inputValue = e.target.value;
            const parsedValue = parseFloat(inputValue);
            if (!isNaN(parsedValue) && isFinite(parsedValue)) {
              setFeeState(parsedValue);
            } else {
              // Optionally handle invalid input
              setFeeState(0);
            }
          }
          
        }}
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
      {sourceError && <p className="error">{'Base Fee is required'}</p>}
    </div>
  );
};

export default BaseFeeInput;
