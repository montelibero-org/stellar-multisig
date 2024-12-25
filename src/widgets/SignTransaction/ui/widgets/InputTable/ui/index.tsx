import { formatDistanceStrict } from "date-fns";
import React, { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { TransactionIcon } from "@/entities";
import Link from "next/link";
import { collapseAccount } from "@/shared/helpers";
import { useSearchParams } from "next/navigation";

interface InputGroupProps {
  sequenceNumber: string;
  transactionFee: string;
  numberOfOperations: string;
  numberOfSignatures: string;
  transactionTime: string; // Время транзакции в формате UTC
  decodingTime: string;
  ID?: string;
}

interface Signer {
  publicKey: string;
  weight: number;
  decodingTime: string; // Decoding time in UTC format
}
interface Props {
  ID: string;
}



const InputTable: FC<InputGroupProps> = ({ decodingTime, ID }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { tx } = useStore(useShallow((state) => state));
  const decodingDate = new Date(decodingTime);

  const {
    net,

    information,
   
  } = useStore(useShallow((state) => state));
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const [isVisibleTx, setIsVisibleTx] = useState<boolean>(false);
  const isValidDecodingDate = !isNaN(decodingDate.getTime());
  const timeDistance = isValidDecodingDate
    ? formatDistanceStrict(decodingDate, currentTime)
    : "Invalid decoding time";
  const { selectedMemoType, setSelectedMemoType } = useStore(
    useShallow((state) => ({
      selectedMemoType: state.selectedMemoType,
      setSelectedMemoType: state.setSelectedMemoType,
    }))
  );
  
   const sortedSigners = React.useMemo(() => {
      if (information?.signers) {
        return [...information.signers]
          .sort((a, b) => (a.key < b.key ? -1 : 1))
          .sort((a, b) => b.weight - a.weight);
      }
      console.log("Signers from API:", information?.signers);
      return [];
    }, [information?.signers]);


  return (
    
    <div className="segment blank">
      <div
        className="container"
        style={{ borderRadius: "10px", overflow: "hidden" }}
      >
        <thead className="bg-gray-100">
          <tr>
            <th
              className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              style={{ fontSize: "18px", borderRadius: "5px" }}
            >
              Public Key
            </th>
            <th
              className="px-6 py-3 text-left text-sm font-medium text-gray-700"
              style={{
                fontSize: "18px",
                borderRadius: "5px",
                padding: "10px 100px",
              }}
            >
              Weight
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedSigners.sort((a) => (a.key === ID ? -1 : 1))
          
            .map((item: { key: string; weight: number }) => (
              
              <li key={item.key}>
                
                <TransactionIcon
                
                  memoText={tx.tx.memo.toString()}
                  selectedMemoType={selectedMemoType}
                  setSelectedMemoType={setSelectedMemoType}
                  ID={ID as string}
                  lowerTime={tx.tx.cond.time.max_time}
                  upperTime={tx.tx.cond.time.min_time}
                  baseFee={tx.tx.fee || 100} 
                  isVisible={isVisibleTx}
                  typeIcon="Change"
                  typeOp="set_options"
                  masterWeight={item.key === ID ? item.weight : null}
                  weight={item.key !== ID ? item.weight : null}
                  sourceAccount={item.key !== ID ? item.key : null}
                />
                <Link href={`/${net}/account?id=${item.key}`} legacyBehavior>
                  <a
                  
                    title={item.key}
                    aria-label={item.key}
                    className="account-address word-break"
                  >
                    <span>{collapseAccount(item.key)} </span>
                  </a>
                </Link>
                (w: <b>{item.weight}</b>)
              </li>
              
            ))}
            
        </tbody>
      </div>

      <div
        className="flex items-center"
        style={{ gap: "10px", marginTop: "20px" }}
      >
        <h3>Decoding Time: </h3>
        {decodingDate ? (
          <span
            title={decodingDate.toLocaleString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            })}
          >
            {timeDistance} ago
          </span>
        ) : (
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Decoding time not available
          </span>
        )}
      </div>
    </div>
  );
};

export default InputTable;
