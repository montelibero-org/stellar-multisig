import { useStore } from "@/shared/store";
import Link from "next/link";
import React, { FC, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { Information } from "@/shared/types";

interface Props {
  isVisible: boolean;
  typeIcon: "Add" | "Change";
  ID: string;
  baseFee?: number;
  lowerTime?: number;
  upperTime?: number;
  TransactionSequenceNumber?: number | null;
  typeOp?: string;
  style?: React.CSSProperties;
  processedKey?: string;
  processedValue?: string;
  sourceAccount?: string | null;
  weight?: number | null;
  operationThresholds?: {
    low_threshold?: number | null;
    med_threshold?: number | null;
    high_threshold?: number | null;
  };
  homeDomain?: string;
  flags?: Information["flags"];
  masterWeight?: number | null;
  memoType?: string;
  selectedMemoType?: string; 
  setSelectedMemoType?: (type: string) => void; 
  memoText?: string | { text?: string; id?: string; hash?: string; return?: string }; 
}

const TransactionIcon: FC<Props> = ({

  isVisible,
  typeIcon,
  ID,
  baseFee,
  lowerTime,
  upperTime,
  // TransactionSequenceNumber,
  typeOp,
  style,
  processedKey,
  processedValue,
  sourceAccount,
  weight,
  operationThresholds,
  homeDomain,
  masterWeight,
  flags,

}) => {
  const { net } = useStore(useShallow((state) => state));
  const previousBaseFee = useRef<number | undefined>(baseFee);
  const previousLowerTime = useRef<number | undefined>(lowerTime);
  const previousUpperTime = useRef<number | undefined>(upperTime);

  useEffect(() => {
    previousBaseFee.current = baseFee;
    previousLowerTime.current = lowerTime;
    previousUpperTime.current = upperTime;
  }, [baseFee, lowerTime, upperTime]);

  if (!isVisible) return null;

  const buildHref = () => {
    const params: Record<string, string> = {
      sourceAccount: ID,
      ...(typeOp && { typeOperation: typeOp }),
      ...(processedKey && processedValue && {
        processedKey,
        processedValue,
      }),
      ...(sourceAccount && { sourceAccountForSetOptions: sourceAccount }),
      ...(weight != null && { weight: weight.toString() }),

      ...(operationThresholds && {
        operationThresholds: [
          operationThresholds.low_threshold != null ? operationThresholds.low_threshold.toString() : "",
          operationThresholds.med_threshold != null ? operationThresholds.med_threshold.toString() : "",
          operationThresholds.high_threshold != null ? operationThresholds.high_threshold.toString() : "",
        ].join(","),
      }),
      ...(homeDomain && { homeDomain }),
      ...(flags?.auth_clawback_enabled && { auth_clawback_enabled: "true" }),
      ...(flags?.auth_immutable && { auth_immutable: "true" }),
      ...(flags?.auth_required && { auth_required: "true" }),
      ...(flags?.auth_revocable && { auth_revocable: "true" }),
    };
   
    if (typeof masterWeight === 'number' && !isNaN(masterWeight)) {
      params.masterWeight = masterWeight.toString();
    }
    if (baseFee !== previousBaseFee.current) {
      params.baseFee = baseFee?.toString() || "";
    }
    
 
    // if (lowerTime !== undefined && lowerTime !== previousLowerTime.current) {
    //   params.lowerTime = lowerTime.toString();
    // }
  
    // if (upperTime !== undefined && upperTime !== previousUpperTime.current) {
    //   params.upperTime = upperTime.toString();
    // }

  
    // if (TransactionSequenceNumber !== null && TransactionSequenceNumber !== undefined && TransactionSequenceNumber !== 0) {
    //   params.TransactionSequenceNumber = TransactionSequenceNumber.toString();
    // }    
    
    return `/${net}/build-transaction?${new URLSearchParams(params).toString()}`;
  };

  return (
    <Link style={style} href={buildHref()}>
      <i
        title={typeIcon}
        className={typeIcon === "Change" ? "fas fa-edit" : "fa-solid fa-plus"}
      ></i>{" "}
    </Link>
  );
};

export default TransactionIcon;