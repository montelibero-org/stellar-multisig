"use client";

import React, { FC, useState, useEffect } from "react";
import { MainLayout, ShowXdr } from "@/widgets";
import { useSearchParams } from "next/navigation";
import {
  TransactionForm,
  TransactionOverview,
} from "@/widgets/SignTransaction";
import useTransactionValidation from "@/features/hooks/signTransaction/useTransactionValidation";
import useXDRDecoding from "@/features/hooks/signTransaction/useXDRDecoding";
import { TransactionBuilder, Networks } from "stellar-sdk";
import { useStore } from "@/shared/store";
import { getAllTransactions } from "@/shared/api/firebase/firestore/Transactions";
import { hrefToXDR } from "@/shared/helpers";
import { useShallow } from "zustand/react/shallow";
import TransactionTable from "@/widgets/SignTransaction/TransactionTable/ui";
import StellarSdk from "stellar-sdk";
export type localSignature = string[];

const SignTransaction: FC = () => {
  const { firestore } = useStore(useShallow((state) => state));

  const href = window.location.href;
  const params = useSearchParams();
  const id: string | undefined | null = params?.get("id");

  const importXDRParam = params?.get("importXDR") ?? "";

  const [signaturesAdded] = useState<number>(0);
  const [currentFirebaseId, setCurrentFirebaseId] = useState<string>("");

  const net = useStore((state) => state.net);
  const networkPassphrase =
    net === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [transactionEnvelope, setTransactionEnvelope] = useState<string>("");
  const [resultXdr, setResultXdr] = useState<string>("");
  const [, setLocalSignatures] = useState<localSignature>([""]);
  const [errorMessageFirebase, setErrorMessageFirebase] = useState<string>("");
  const [successMessageFirebase, setSuccessMessageFirebase] =
    useState<string>("");

  const { validateTransactionEnvelope } = useTransactionValidation();
  useEffect(() => {
    setIsValidId(id ? StellarSdk.StrKey.isValidEd25519PublicKey(id) : null);
  }, [id]);
  useEffect(() => {
    if (transactionEnvelope) {
      validateTransactionEnvelope(transactionEnvelope);
    }
  }, [transactionEnvelope]);

  const {
    transactionHash,
    sourceAccount,
    sequenceNumber,
    transactionFee,
    operationCount,
    signatureCount,
    transaction,
    decodingTime,
  } = useXDRDecoding(importXDRParam, transactionEnvelope);

  const currentTransaction = React.useMemo(() => {
    if (!resultXdr) return null;
    try {
      return TransactionBuilder.fromXDR(resultXdr, networkPassphrase);
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [resultXdr, networkPassphrase]);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        const data = await getAllTransactions(firestore, net);
        const matchingDoc = data.find((doc) => doc.xdr === transactionEnvelope);
        if (matchingDoc) {
          setCurrentFirebaseId(matchingDoc.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (!transactionEnvelope) {
      setLocalSignatures([""]);
      setResultXdr("");
    } else {
      fetchAllTransactions();
    }
  }, [transactionEnvelope, net]);

  useEffect(() => {
    if (importXDRParam && window) {
      setTransactionEnvelope(hrefToXDR(href));
    }
  }, [window, importXDRParam, href]);

  useEffect(() => {
    console.log(resultXdr)
  }, [resultXdr]);

  return (
    <MainLayout>
      {importXDRParam ? (
        <>
          <TransactionOverview
            transactionEnvelope={transactionEnvelope}
            transactionHash={transactionHash}
            sourceAccount={sourceAccount}
            sequenceNumber={sequenceNumber}
            transactionFee={transactionFee}
            operationCount={operationCount}
            signatureCount={signatureCount}
            transaction={transaction}
            decodingTime={decodingTime}
          />


          <TransactionSignatures

          {/* <TransactionSignatures

            localSignatures={localSignatures}
            setLocalSignatures={setLocalSignatures}
            transactionEnvelope={transactionEnvelope}
            resultXdr={resultXdr}
            setResultXdr={setResultXdr}
            currentTransaction={transaction}
            setSignaturesAdded={setSignaturesAdded}
            signaturesAdded={signaturesAdded}

          />
          <TransactionTable

            transactionEnvelope={transactionEnvelope}
            transactionHash={transactionHash}
            sourceAccount={sourceAccount}
            sequenceNumber={sequenceNumber}
            transactionFee={transactionFee}
            operationCount={operationCount}
            signatureCount={signatureCount}
            transaction={transaction}
            decodingTime={decodingTime}
          />

          /> */}

          {resultXdr && (
            <ShowXdr
              title="Transaction signed!"
              upperDescription={`${signaturesAdded} signature(s) added; ${
                currentTransaction?.signatures.length || 0
              } signature(s) total`}
              xdr={resultXdr}
              lowerDescription="Now that this transaction is signed, you can submit it to the network. Horizon provides an endpoint called Post Transaction that will relay your transaction to the network and inform you of the result."
              successMessage={successMessageFirebase}
              errorMessage={errorMessageFirebase}
              currentFirebaseId={currentFirebaseId}
              successMessageFirebase={successMessageFirebase}
              setSuccessMessageFirebase={setSuccessMessageFirebase}
              setErrorMessageFirebase={setErrorMessageFirebase}
            />
          )}
        </>
      ) : (
        <TransactionForm
          isSignPage
          XDR={transactionEnvelope}
          setXDR={setTransactionEnvelope}
        />
      )}
    </MainLayout>
  );
};

export default SignTransaction;
