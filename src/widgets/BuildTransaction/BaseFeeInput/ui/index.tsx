"use client";

import { FC } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

const BaseFeeInput: FC = () => {
  const { tx, setFee } = useStore(useShallow((state) => state));

  return (
    <div>
      <h4>Base Fee</h4>
      <input
        placeholder="Amount in stroops"
        value={tx.tx.fee}
        onChange={(e) => setFee(Number(e.target.value))}
      />
      <p>
        The base inclusion fee is currently set to 100 stroops (0.00001 lumens). For real-time fee stats, see{" "}
        <a
          href="https://developers.stellar.org/docs/data-and-data-structures/fees/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fee Statistics
        </a>.
      </p>
    </div>
  );
};

export default BaseFeeInput;
