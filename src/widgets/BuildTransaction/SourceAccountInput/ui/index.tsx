"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";

import axios from "axios";
import { Information } from "@/shared/types";

const SourceAccountInput: FC = () => {
  const { tx, setSourceAccount, accounts, server } = useStore(
    useShallow((state) => state)
  );
  const [sourceError, setSourceError] = useState<string>("");
  const validateFee = (value: number | string) => {
    if (typeof value === 'string') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) {
        setSourceError("Base Fee is required");
      } else {
        setSourceError(""); // Clear the error when a valid fee is entered
      }
    } else if (typeof value === 'number') {
      if (value <= 0 || isNaN(value) || !isFinite(value)) {
        setSourceError("Base Fee is required");
      } else {
        setSourceError(""); // Clear the error when a valid fee is entered
      }
    }
  };
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
        } else {
          console.warn("No eligible signers found");
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
  useEffect(() => {
    validateFee((tx.tx.source_account)); // validate the fee on load or whenever feeState changes
  }, [tx.tx.source_account]);
  return (
    <div>
      <div className="flex items-center ">
        <h4>Source Account</h4>
      </div>
      <input
        placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
        value={tx.tx.source_account}
        onChange={(e) => setSourceAccount(e.target.value)}
      />
{sourceError && <p className="error">{'Source Account is required'}</p>}
    </div>
  );
};

export default SourceAccountInput;