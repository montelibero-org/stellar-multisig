"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { checkSigner } from "@/shared/helpers";
import axios from "axios";
import { Information } from "@/shared/types";

const SourceAccountInput: FC = () => {
  const { tx, setSourceAccount, accounts, server } = useStore(
    useShallow((state) => state)
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const validateSourceAccount = async () => {
      const sourceAccountKey = tx.tx.source_account;
      const isValidKey =
        StellarSdk.StrKey.isValidEd25519PublicKey(sourceAccountKey);

      if (!isValidKey) {
        setError("Invalid source account");
        return;
      }

      try {
        const {
          data: { signers },
        } = await axios.get<Information>(
          `${server}/accounts/${sourceAccountKey}`
        );

        const eligibleSigners = signers?.filter((signer) => signer.weight >= 1);

        if (Array.isArray(eligibleSigners) && eligibleSigners.length > 0) {
          const validSignerExists = checkSigner(accounts, eligibleSigners);
          setError(validSignerExists ? "" : "Not enough rights");
        } else {
          setError("No eligible signers found");
        }
      } catch (fetchError) {
        console.error("Error fetching signers:", fetchError);
        setError("Failed to fetch signer information");
      }
    };

    validateSourceAccount();
  }, [tx.tx.source_account, accounts, server]);

  useEffect(() => {
    const params = new URLSearchParams(tx.tx.source_account.toString());
    params.set("sourceAccount", tx.tx.source_account.toString());

    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [tx.tx.source_account]);
  return (
    <div>
      <h4>Source Account</h4>
      <input
        placeholder="Example: GCEXAMPLE..."
        value={tx.tx.source_account}
        onChange={(e) => setSourceAccount(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SourceAccountInput;
