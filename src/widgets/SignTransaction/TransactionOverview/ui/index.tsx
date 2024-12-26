import React, { FC, useEffect, useState } from "react";
import { Header, InputField, InputGroup } from "../../ui/widgets"
import { Transaction } from "stellar-sdk";
import InputTable from "../../ui/widgets/InputTable";

interface TransactionOverviewProps {
  transactionEnvelope: string;
  transactionHash: string;
  sourceAccount: string;
  sequenceNumber: string;
  transactionFee: string;
  operationCount: string;
  signatureCount: string;
  transaction: Transaction | null
  decodingTime: string
}

const TransactionOverview: FC<TransactionOverviewProps> = ({
  transactionEnvelope,
  transactionHash,
  sourceAccount,
  sequenceNumber,
  transactionFee,
  operationCount,
  signatureCount,
  transaction,
  decodingTime
}) => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toISOString());
  useEffect(() => {
    // Обновление текущего времени каждую секунду
    const interval = setInterval(() => setCurrentTime(new Date().toISOString()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="container" style={{ color: "#fff" }}>
      {/* Header */}
      <Header title="Transaction Overview" button={true} />

      <div className="segment blank">
        {/* Signing for input */}
        <InputField
          label="Signing for"
          value={transaction?.networkPassphrase || ""}
        />

        {/* Transaction Envelope XDR */}
        <InputField label="Transaction Envelope XDR" value={transactionEnvelope} textarea />

        {/* Transaction Hash */}
        <InputField label="Transaction Hash" value={transactionHash} />

        {/* Source Account */}
        <InputField label="Source account" value={sourceAccount} />

        {/* Input Group */}
        <InputGroup
          sequenceNumber={sequenceNumber}
          transactionFee={transactionFee}
          numberOfOperations={operationCount}
          numberOfSignatures={signatureCount}
          transactionTime={currentTime}
          decodingTime={decodingTime} 
        />

      </div>
    </div>
  );
};

export default TransactionOverview;
