"use client";

import AccountInfo from "./AccountInfo";
import StellarSdk from "stellar-sdk";
import { MainLayout } from "@/widgets";
import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputTable from "@/widgets/SignTransaction/ui/widgets/InputTable";

const Account: FC = () => {
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const params = useSearchParams();
  const id: string | undefined | null = params?.get("id");

  useEffect(() => {
    if (id) setIsValidId(StellarSdk.StrKey.isValidEd25519PublicKey(id));
  }, [id]);

  if (!id || isValidId === null) {
    return (
      <MainLayout>
        <center>
          <h1>Loading...</h1>
        </center>
      </MainLayout>
    );
  }

  if (!id || isValidId === false) {
    return (
      <MainLayout>
        <div className="container">
          <div
            className="search error container narrow"
            style={{ padding: "20px" }}
          >
            <h2 className="text-overflow">Search results for {id}</h2>
            <div>User ID not found or invalid.</div>
          </div>
        </div>
        <InputTable ID={id} decodingTime="2024-12-22T10:00:00Z" sequenceNumber={""} transactionFee={""} numberOfOperations={""} numberOfSignatures={""} transactionTime={""} />
      </MainLayout>
    );
  }
  
  return typeof id === "string" && <AccountInfo ID={id}  />;
};

export default Account;
