import React from "react";
import Header from "./header";
import Footer from "./footer";

const MainLayout = ({ children }) => {
    return (
        <main className="flex min-h-screen flex-col">
            <div className="blue-ribbon"></div>
            <Header />
            <div className="page-container">{children}</div>
            <Footer />
        </main>
    );
};

export default MainLayout;
