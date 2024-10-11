import React, { FC } from "react";

interface Props {
  condition: boolean;
  onToggle: () => void;
  style?: React.CSSProperties;
}

const IsShowedBlock: FC<Props> = ({ onToggle, condition, style }) => {
  const className = condition ? "fa-solid fa-angles-up" : "fa-solid fa-angles-down";
  const title = condition ? "Hide balances" : "Show balances";

  return (
    <i
      className={className}
      style={style}
      title={title}
      onClick={onToggle}
    ></i>
  );
};

export default IsShowedBlock;
