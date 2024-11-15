"use client";

import { FC, useEffect } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";

import axios from "axios";
import { Information } from "@/shared/types";

const SourceAccountInput: FC = () => {
  const { tx, setSourceAccount, accounts, server } = useStore(
    useShallow((state) => state)
  );

  useEffect(() => {
    const validateSourceAccount = async () => {
      const sourceAccountKey = tx.tx.source_account;
      const isValidKey =
        StellarSdk.StrKey.isValidEd25519PublicKey(sourceAccountKey);

      if (!isValidKey) {
        console.warn("Invalid source account key");
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
          console.log("Eligible signers found:", eligibleSigners);
          // Additional logic for handling eligible signers can go here
        } else {
          console.warn("No eligible signers found");
          // Handle case when no eligible signers are found
        }
      } catch (fetchError) {
        console.error("Error fetching signers:", fetchError);
      }
    };

    validateSourceAccount();
  }, [tx.tx.source_account, accounts, server]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sourceAccount", tx.tx.source_account);

    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [tx.tx.source_account]);

  return (
    <div>
      <div className="flex items-center ">
        <h4>Source Account</h4>
      </div>
      <input
        placeholder="Example: GCEXAMPLE..."
        value={tx.tx.source_account}
        onChange={(e) => setSourceAccount(e.target.value)}
      />
    </div>
  );
};

export default SourceAccountInput;
