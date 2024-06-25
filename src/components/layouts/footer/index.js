"use client";

import React, { useEffect, useState } from "react";

const Footer = ({ setTheme }) => {
    const [value, setValue] = useState("night");

    useEffect(() => {
        setTheme(value);
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
                        <i className="icon icon-github"></i> Request a new feature&nbsp;
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
                        onClick={() => {
                            setValue(value == "night" ? "day" : "night");
                        }}
                    >
                        <i
                            className={`icon icon-${value == "night" ? "day" : "night"
                                }`}
                        ></i>{" "}
                        {value == "night" ? "Light" : "Dark"} theme
                    </a>
                </div>
                <div className="dimmed condensed" style={{ fontSize: "0.8em" }}>
                    Donations:{" "}
                    <span className="" tabIndex="-1">
                        <a href="/public/GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN">
                            GCSAXEHZBQY65URLO6YYDOCTRLIGTNMGCQHVW2RZPFNPTEJN6VN7TFIN
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
