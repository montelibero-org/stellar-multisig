"use client";

import React, { FC } from "react";
import Link from "next/link";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

const Footer: FC = () => {
    const { net, setNet, theme, setTheme } = useStore(
        useShallow((state) => ({
            net: state.net,
            setNet: state.setNet,
            theme: state.theme,
            setTheme: state.setTheme,
        }))
    );

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
                            setTheme(theme === "day" ? "night" : "day");
                        }}
                    >
                        <i
                            className={`icon icon-${
                                theme === "day" ? "night" : "day"
                            }`}
                        ></i>{" "}
                        {theme === "day" ? "Dark" : "Light"} theme
                    </a>
                </div>
                <div className="dimmed condensed" style={{ fontSize: "0.8em" }}>
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
