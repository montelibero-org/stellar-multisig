import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

const Container: FC<Props> = ({ children, className, title }) => {
  return (
    <div className={`container ${className}`}>
      <h2>{title}</h2>
      <div className="segment blank">{children}</div>
    </div>
  );
};

export default Container;
