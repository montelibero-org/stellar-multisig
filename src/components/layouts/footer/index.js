"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation

const Footer = ({ setTheme }) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        const _theme = localStorage.getItem("theme");
        if (_theme) {
            setTheme(_theme);
            setValue(_theme);
        }
    }, []);

    useEffect(() => {
        if (value) {
            localStorage.setItem("theme", value);
            setTheme(value);
        }
    }, [value]);

    return (
        <div className="footer">
            <div className="container text-center">
                <div>
                    ©&nbsp;MTL Stellar Multisig <span className="dimmed"></span>
                </div>
                <div>
                    <a
                        href="https://github.com/montelibero-org/stellar-multisig/issues"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="nowrap"
                    >
                        <i className="icon icon-github"></i> Request a new
                        feature&nbsp;
                    </a>
                    <a
                        href="https://github.com/montelibero-org/stellar-multisig/issues"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="nowrap"
                    >
                        <i className="icon icon-github"></i> Report a bug&nbsp;
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent the default anchor tag behavior
                            setValue(value === "day" ? "night" : "day");
                        }}
                    >
                        <i className={`icon icon-${value === "day" ? "night" : "day"}`}></i>{" "}
                        {value === "day" ? "Dark" : "Light"} theme
                    </a>
                </div>
                <div className="dimmed condensed" style={{ fontSize: "0.8em" }}>
                    Donations:{" "}
                    <span className="" tabIndex="-1">
                        <Link href="/public/GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN">
                            GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
