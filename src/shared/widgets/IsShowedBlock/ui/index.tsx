import Link from "next/link";
import React, { FC } from "react";

interface Props {
  condition: boolean;
  onToggle: () => void;
  title?: string;
  style?: React.CSSProperties;
}

const IsShowedBlock: FC<Props> = ({ onToggle, condition, style, title }) => {
  const className = condition
    ? "fa-solid fa-angles-up"
    : "fa-solid fa-angles-down";
    title = condition ? "Collapse" : "Expand";
  return (
    <Link href="#">
      <i
        className={className}
        style={style}
        title={title}
        onClick={onToggle}
      ></i>
    </Link>
  );
};

export default IsShowedBlock;
