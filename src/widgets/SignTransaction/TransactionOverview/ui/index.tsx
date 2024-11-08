import React, { FC } from "react";
import { Header, InputField, InputGroup } from "../../ui/widgets"
import { Transaction } from "stellar-sdk";

interface TransactionOverviewProps {
  transactionEnvelope: string;
  transactionHash: string;
  sourceAccount: string;
  sequenceNumber: string;
  transactionFee: string;
  operationCount: string;
  signatureCount: string;
  transaction: Transaction | null
}

const TransactionOverview: FC<TransactionOverviewProps> = ({
  transactionEnvelope,
  transactionHash,
  sourceAccount,
  sequenceNumber,
  transactionFee,
  operationCount,
  signatureCount,
  transaction
}) => {

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
        />
      </div>
    </div>
  );
};

export default TransactionOverview;
