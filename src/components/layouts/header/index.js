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
                onClick={() => {
                    router.push("/");
                }}
            >
                <h2
                    style={{
                        display: "inline-flex",
                    }}
                >
                    <Image
                        src="/montelibero-small-logo.png"
                        alt="Montelibero Logo"
                        className="dark:invert"
                        width={30}
                        height={30}
                        priority
                    />{" "}&nbsp;
                    MTL Stellar Multisig
                </h2>
            </div>
            <span>Network: Public</span>
        </header>
    );
};

export default Header;
