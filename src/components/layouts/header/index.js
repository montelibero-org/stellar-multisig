"use client";

import React, { useEffect } from "react";
import "./header.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePublic } from "@/context/net";

const Header = () => {
    const router = useRouter();

    const { net } = usePublic();

    return (
        <div className="top-block">
            <div className="container nav relative">
                <a
                    href="/"
                    className="logo"
                    style={{
                        paddingTop: "7px",
                    }}
                >
                    <Image
                        src="/montelibero-small-logo.png"
                        alt="Montelibero Logo"
                        className="dark:invert"
                        width={30}
                        height={30}
                        priority
                    />{" "}
                    &nbsp; MTL Stellar Multisig
                </a>
                <div className="nav-menu-dropdown false">
                    <div className="main-menu top-menu-block">
                        <a href="/public/assets">Assets</a>
                    </div>
                    <div
                        className="top-menu-block right"
                        style={{
                            float: "right",
                        }}
                    >
                        <div className="network-switch">
                            Network : {net == "public" ? "Public" : "Testnet"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
