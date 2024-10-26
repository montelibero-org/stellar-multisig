import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  defaultContainer?: boolean;
}

const MainLayout: FC<Props> = ({ children, defaultContainer }) => {
  return (
    <div className="page-container">
      {defaultContainer && <div className="container">{children}</div>}
      {!defaultContainer && children}
    </div>
  );
};

export default MainLayout;
