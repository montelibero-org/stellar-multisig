"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation
import { usePublic } from "@/context/net";

const Footer = ({setTheme}) => {

    const [value, setValue] = useState("");
    const [net, setNet] = usePublic();
    const stableSetTheme = useCallback(
        (theme) => {
            setTheme(theme);
        },
        [setTheme]
    );
    useEffect(() => {
        const _theme = localStorage.getItem("theme");
        if (_theme) {
            stableSetTheme(_theme);
            setValue(_theme);
        }
    }, [stableSetTheme]); // Include stableSetTheme in the dependency array

    useEffect(() => {
        if (value) {
            localStorage.setItem("theme", value);
            stableSetTheme(value);
        }
    }, [value, stableSetTheme]);

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
                            e.preventDefault();
                            setValue(value === "day" ? "night" : "day");
                            setTheme(value === "day" ? "night" : "day");
                        }}
                    >
                        <i
                            className={`icon icon-${
                                value === "day" ? "night" : "day"
                            }`}
                        ></i>{" "}
                        {value === "day" ? "Dark" : "Light"} theme
                    </a>
                </div>
                <div className="dimmed condensed" style={{ fontSize: "0.8em" }}>
                    Donations:{" "}
                    <span className="" tabIndex="-1">
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
//
