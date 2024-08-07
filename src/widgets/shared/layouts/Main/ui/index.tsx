import React, { FC } from "react";

interface Props {
    children: React.ReactNode
}

const MainLayout: FC<Props> = ({ children }) => {
    return <div className="page-container">{children}</div>;
};

export default MainLayout;