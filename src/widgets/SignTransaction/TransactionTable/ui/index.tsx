
import React, { useEffect, useState } from 'react'
import { Header } from '../../ui/widgets'
import InputTable from '../../ui/widgets/InputTable'

import { Transaction } from "stellar-sdk";
import { useSearchParams } from 'next/navigation';
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


const TransactionTable: React.FC<TransactionOverviewProps> = ({  transactionEnvelope,

  sequenceNumber,
  transactionFee,
  operationCount,
  signatureCount,

  decodingTime}) => {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toISOString());
   
  useEffect(() => {
    // Обновление текущего времени каждую секунду
    const interval = setInterval(() => setCurrentTime(new Date().toISOString()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="container" style={{ color: "#fff", }}>
    <Header title="Signatures" />
    <div className="segment blank" >

    <InputTable
         
          sequenceNumber={sequenceNumber}
          transactionFee={transactionFee}
          numberOfOperations={operationCount}
          numberOfSignatures={signatureCount}
          transactionTime={currentTime}
          decodingTime={decodingTime}        />
    </div>
   
    </div>
    
  )
}
export default TransactionTable