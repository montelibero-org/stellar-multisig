"use client";

import React, { FC, useState } from "react";
import { useXDRDecoding } from "@/features/hooks";

interface Props {
  title?: string;
  upperDescription?: string;
  xdr?: string | null;
  lowerDescription?: string;
  showHash?: boolean;
  showNetPassphrase?: boolean;
  buttons?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
}

const ShowXdr: FC<Props> = ({
  title,
  upperDescription,
  xdr,
  showNetPassphrase,
  showHash,
  lowerDescription,
  buttons,
  errorMessage,
  successMessage,
}) => {
  const [isCopy, setIsCopy] = useState(false);

  const { transaction, transactionHash } = useXDRDecoding(xdr, xdr || "");

  return (
    <div className="container">
      <div style={{ marginTop: "20px" }} className="segment blank">
            <h3 className="success">{title}</h3>
            <p>{upperDescription}</p>
            <textarea
              value={
                xdr && !showNetPassphrase && !showHash
                  ? xdr
                  : !showNetPassphrase && showHash
                  ? `Hash:\n${transactionHash}\nXDR:\n${xdr}`
                  : showNetPassphrase && !showHash
                  ? `Network Passphrase:\n${transaction?.networkPassphrase}\nXDR:\n${xdr}`
                  : `Network Passphrase:\n${transaction?.networkPassphrase}\nHash:\n${transactionHash}\nXDR:\n${xdr}`
              }
              readOnly
              style={{ height: "120px", border: "1px solid #535759" }}
            />

            <p
              style={{ cursor: "pointer", position: "absolute", right: "30px" }}
              onClick={() => {
                navigator.clipboard.writeText(xdr!);
                setIsCopy(true);
                setTimeout(() => setIsCopy(false), 2000);
              }}
              title="Copy XDR"
            >
              <i className="fa-solid fa-copy"></i>
            </p>
            {isCopy && (
              <p style={{ textAlign: "right", opacity: "0.8", marginRight: "28px" }}>Copied XDR</p>
            )}
            <p>{lowerDescription}</p>
            <div style={{ marginTop: "-10px" }}>
            {buttons}
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            </div>
      </div>
    </div>
  );
};

export default ShowXdr;
