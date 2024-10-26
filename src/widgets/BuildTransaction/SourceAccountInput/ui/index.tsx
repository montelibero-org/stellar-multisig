"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { checkSigner } from "@/shared/helpers";

const SourceAccountInput: FC = () => {
  const { tx, setSourceAccount, accounts } = useStore(useShallow((state) => state));
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const isValidKey = StellarSdk.StrKey.isValidEd25519PublicKey(tx.tx.source_account);
    setIsValid(isValidKey);
    if (!isValidKey) {
      setError("Invalid source account");
    } else if (!checkSigner(accounts, undefined, 1, tx.tx.source_account)) {
      setError("Not enough rights");
    } else {
      setError("");
    }
  }, [tx.tx.source_account, accounts]);

  return (
    <div>
      <h4>Source Account</h4>
      <input
        placeholder="Example: GCEXAMPLE..."
        value={tx.tx.source_account}
        onChange={(e) => setSourceAccount(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      {!isValid && <></>}
    </div>
  );
};

export default SourceAccountInput;
