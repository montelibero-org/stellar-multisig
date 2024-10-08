"use client";

import AccountInfo from "./AccountInfo";
import StellarSdk from "stellar-sdk";
import { MainLayout } from "@/widgets";
import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
      </MainLayout>
    );
  }

  return typeof id === "string" && <AccountInfo ID={id} />;
};

export default Account;
