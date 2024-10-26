import { useStore } from "@/shared/store";
import Link from "next/link";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import { Information } from "@/shared/types";

interface Props {
  isVisible: boolean;
  typeIcon: "Add" | "Change";
  ID: string;
  typeOp?: string;
  style?: React.CSSProperties;
  processedKey?: string;
  processedValue?: string | JSX.Element;
  sourceAccount?: string;
  weight?: number | null;
  operationThresholds?: {
    low_threshold?: number | null;
    med_threshold?: number | null;
    high_threshold?: number | null;
  };
  homeDomain?: string;
  flags?: Information["flags"];
}

const TransactionIcon: FC<Props> = ({
  isVisible,
  typeIcon,
  ID,
  typeOp,
  style,
  processedKey,
  processedValue,
  sourceAccount,
  weight,
  operationThresholds,
  homeDomain,
  flags,
}) => {
  const { net } = useStore(useShallow((state) => state));

  if (!isVisible) return null;

  return (
    <Link
      style={style}
      href={`/${net}/build-transaction?sourceAccount=${ID}${
        typeOp ? `&typeOperation=${typeOp}` : ``
      }${
        processedKey && processedValue
          ? `&processedKey=${processedKey}&processedValue=${processedValue}`
          : ``
      }${sourceAccount ? `&sourceAccountForSetOptions=${sourceAccount}` : ``}${
        weight ? `&weight=${weight}` : ``
      }${
        operationThresholds
          ? `&operationThresholds=${operationThresholds.low_threshold},${operationThresholds.med_threshold},${operationThresholds.high_threshold}`
          : ``
      }${homeDomain ? `&homeDomain=${homeDomain}` : ``}${
        flags?.auth_clawback_enabled ? `&auth_clawback_enabled=true` : ``
      }${flags?.auth_immutable ? `&auth_immutable=true` : ``}${
        flags?.auth_required ? `&auth_required=true` : ``
      }${flags?.auth_revocable ? `&auth_revocable=true` : ``}
`}
    >
      <i
        title={typeIcon}
        className={typeIcon === "Change" ? "fas fa-edit" : "fa-solid fa-plus"}
      ></i>{" "}
    </Link>
  );
};

export default TransactionIcon;
