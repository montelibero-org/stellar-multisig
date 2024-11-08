import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
};

const Container: FC<Props> = ({ children, className, title, style }) => {
  return (
    <div style={style} className={`container ${className}`}>
      <h2>{title}</h2>
      <div className="segment blank">{children}</div>
    </div>
  );
};

export default Container;
