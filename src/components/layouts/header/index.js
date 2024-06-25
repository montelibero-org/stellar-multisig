"use client";

import React from "react";
import "./header.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux';

const Header = () => {
    const router = useRouter();
    const net = useSelector((state) => state.net);

    return (
        <div className="top-block">
            <div className="container nav relative">
                <Link
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
                </Link>
                <div className="nav-menu-dropdown false">
                    <div className="main-menu top-menu-block">
                        <Link href="/public/assets">Assets</Link>
                    </div>
                    <div
                        className="top-menu-block right"
                        style={{
                            float: "right",
                        }}
                    >
                        <div className="network-switch">Network : {net}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
