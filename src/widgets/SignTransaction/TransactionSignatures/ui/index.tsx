import React, { FC } from "react";
import { Header, InputField } from "../../ui/widgets";
import { localSignature } from "@/views/SignTransaction/page";
import { getSecretKeyError, signTransaction } from "@/features/helpers";
import { Networks } from "@stellar/stellar-sdk";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { Transaction } from "stellar-sdk";

interface Props {
  localSignatures: localSignature;
  setLocalSignatures: (localSignatures: localSignature) => void;
  transactionEnvelope: string;
  resultXdr: string;
  setResultXdr: (resultXdr: string) => void;
  currentTransaction: Transaction | null;
  signaturesAdded: number;
  setSignaturesAdded: (signaturesAdded: number) => void;
}

const TransactionSignatures: FC<Props> = ({
  localSignatures,
  setLocalSignatures,
  transactionEnvelope,
  resultXdr,
  setResultXdr,
  signaturesAdded,
  setSignaturesAdded,
}) => {
  const { net } = useStore(useShallow((store) => store));

  const handleSetSignature = (value: string, index: number) => {
    const newSignatures = [...localSignatures];
    newSignatures[index] = value;
    setLocalSignatures(newSignatures);
  };

  const handleSignTransaction = async () => {
    try {
      const validSignatures = localSignatures.filter(
        (sig) => sig && sig.trim() !== "" && !getSecretKeyError(sig)
      );

      const signedXDR = await signTransaction(
        validSignatures,
        net === "testnet" ? Networks.TESTNET : Networks.PUBLIC,
        transactionEnvelope
     );

     if (signedXDR !== resultXdr) {
       setSignaturesAdded(signaturesAdded + 1);
       setResultXdr(signedXDR);
     }

    } catch (error) {
      console.error("Error signing transaction:", error);
      alert(`Error signing transaction: ${error}`);
      setResultXdr("");
    }
  };

  return (
    <div className="container">
      <Header title="Signatures" />
      <div className="segment blank">
        {localSignatures.map((signature: string, index: number) => (
          <InputField
            key={index}
            label={index === 0 ? "Add Signer" : undefined}
            validate={getSecretKeyError}
            readOnly={false}
            value={signature || ""}
            setValue={(value) => handleSetSignature(value, index)}
            isDeleting={index !== 0}
            placeholder={
              "Secret key (starts with S) or hash preimage (in hex)"
            }
            index={index}
            localSignatures={localSignatures}
            setLocalSignatures={setLocalSignatures}
          />
        ))}
        <button
          disabled={localSignatures.some(
            (sig) => !sig || sig.trim() === "" || getSecretKeyError(sig)
          )}
          onClick={handleSignTransaction}
        >
          Sign Transaction
        </button>
        <button onClick={() => setLocalSignatures([...localSignatures, ""])}>
          Add Signature
        </button>
      </div>
    </div>
  );
};

export default TransactionSignatures;
