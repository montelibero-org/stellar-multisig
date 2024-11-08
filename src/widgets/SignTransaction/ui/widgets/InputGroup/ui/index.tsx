import { FC } from "react";
import { InputField } from "../.."
interface InputGroupProps {
  sequenceNumber: string;
  transactionFee: string;
  numberOfOperations: string;
  numberOfSignatures: string;
}

const InputGroup: FC<InputGroupProps> = ({
  sequenceNumber,
  transactionFee,
  numberOfOperations,
  numberOfSignatures,
}) => (
  <>
    {/* First Row */}
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <InputField label="Sequence number" value={sequenceNumber} flex={true} />
        <InputField label="Transaction Fee (stroops)" value={transactionFee} flex={true} />
    </div>

    {/* Second Row */}
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "10px" }}>
        <InputField label="Number of operations" value={numberOfOperations} flex={true} />
        <InputField label="Number of existing signatures" value={numberOfSignatures} flex={true} />
    </div>
  </>
);

export default InputGroup
