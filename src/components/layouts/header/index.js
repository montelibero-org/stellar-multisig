"use client";

import React from "react";
import "./header.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    return (
        <header>
            <div
                className="logo"
                onClick={() => {
                    router.push("/");
                }}
            >
                <h2>
                    MTL
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        className="dark:invert"
                        width={30}
                        height={30}
                        priority
                    />
                    Stellar Multisig
                </h2>
            </div>
            <span>Search Account</span>
        </header>
    );
};

export default Header;
