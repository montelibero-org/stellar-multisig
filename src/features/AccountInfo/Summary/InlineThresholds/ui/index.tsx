import { TransactionIcon } from "@/entities";
import { useStore } from "@/shared/store";
import React, { FC } from "react";

interface InlineThresholdsProps {
  ID: string;
  isVisibleTx: boolean;
  signerWeights: number;
}

const InlineThresholds: FC<InlineThresholdsProps> = ({
  ID,
  isVisibleTx,
  signerWeights,
}) => {
  const { information } = useStore((state) => state);

  const thresholds = [
    {
      label: "Low",
      value: Number(information?.thresholds?.low_threshold),
      title: "Low threshold",
    },
    {
      label: "Med",
      value: Number(information?.thresholds?.med_threshold),
      title: "Medium threshold",
    },
    {
      label: "High",
      value: Number(information?.thresholds?.high_threshold),
      title: "High threshold",
    },
  ];

  return (
    <>
      <TransactionIcon
        ID={ID}
        isVisible={isVisibleTx}
        typeIcon="Change"
        typeOp="set_options"
        operationThresholds={information?.thresholds}
      />
      <dt>Thresholds:</dt>
      <dd>
        {thresholds.map((threshold, index) => (
          <React.Fragment key={threshold.label}>
            {index > 0 && " / "}
            <span title={threshold.title}>
              {signerWeights > threshold.value && signerWeights !== 0 ? (
                <span
                  title={`${threshold.label} threshold is unlocked, operations are permitted`}
                >
                  {threshold.label}{" "}🟢{" "}
                </span>
              ) : (
                <span
                  title={`${threshold.label} threshold is locked, operations are prohibited`}
                >
                  {threshold.label}{" "}🔴{" "}
                </span>
              )}
              <span
                title={
                  signerWeights > threshold.value && signerWeights !== 0
                    ? `${threshold.label} threshold is unlocked, operations are permitted`
                    : `${threshold.label} threshold is locked, operations are prohibited`
                }
              >
                {threshold.value}
              </span>
            </span>
          </React.Fragment>
        ))}
        <i className="trigger icon info-tooltip small icon-help">
          <div
            className="tooltip-wrapper"
            style={{
              maxWidth: "20em",
              left: "-193px",
              top: "-86px",
            }}
          >
            <div className="tooltip top">
              <div className="tooltip-content">
                This field specifies thresholds for low-, medium-, and
                high-access level operations.
                <a
                  href="https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds"
                  className="info-tooltip-link"
                  target="_blank"
                >
                  Read more…
                </a>
              </div>
            </div>
          </div>{" "}
        </i>
      </dd>
    </>
  );
};

export default InlineThresholds;
