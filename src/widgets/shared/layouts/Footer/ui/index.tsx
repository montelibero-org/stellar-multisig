"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

const Footer: FC = () => {
    const { net, theme, setTheme } = useStore(
        useShallow((state) => ({
            net: state.net,
            theme: state.theme,
            setTheme: state.setTheme,
        }))
    );

    // State to handle window width
    const [isMobile, setIsMobile] = useState(false);

    // Effect to update the state based on window width
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the width threshold as needed
        };

        handleResize(); // Check on initial load
        window.addEventListener("resize", handleResize); // Listen for window resize

        // Clean up the event listener
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Inline styles
    const footerContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Change layout based on screen width
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
    };

    const linkStyle: React.CSSProperties = {
        margin: "4px 0",
    };

    const donationsStyle: React.CSSProperties ={
        fontSize: "0.8em",
        textAlign: "center",
    };

    return (
        <div className="footer">
            <div className="container text-center">
                <div>
                    ©&nbsp;MTL Stellar Multisig <span className="dimmed"></span>
                </div>
                <div style={footerContainerStyle}>
                    <a
                        href="https://github.com/montelibero-org/stellar-multisig/issues"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="nowrap"
                        style={linkStyle}
                    >
                        <i className="icon icon-github"></i> Request a new feature&nbsp;
                    </a>
                    <a
                        href="https://github.com/montelibero-org/stellar-multisig/issues"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="nowrap"
                        style={linkStyle}
                    >
                        <i className="icon icon-github"></i> Report a bug&nbsp;
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setTheme(theme === "day" ? "night" : "day" as const);
                        }}
                        style={linkStyle}
                    >
                        <i
                            className={`icon icon-${theme === "day" ? "night" : "day"}`}
                        ></i>{" "}
                        {theme === "day" ? "Dark" : "Light"} theme
                    </a>
                </div>
                <div className="dimmed condensed" style={donationsStyle}>
                    Donations:{" "}
                    <span className="" tabIndex={-1}>
                        <Link
                            href={`/${net}/account?id=GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN`}
                        >
                            GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
