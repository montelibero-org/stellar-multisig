"use client";

import "./header.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

export const Header: FC = () => {
    const router = useRouter();
    const { net, setNet, theme, setTheme } = useStore(
        useShallow((state) => ({
            net: state.net,
            setNet: state.setNet,
            theme: state.theme,
            setTheme: state.setTheme,
        }))
    );
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false); // Close dropdown if clicked outside
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on cleanup
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Log the current state for debugging
        console.log("Net:", net);
        console.log("Theme:", theme);
    }, [net, theme]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (network: string) => {
        setNet(network);
        localStorage.setItem("net", network); // Store the network in localStorage
        setIsOpen(false);

        const currentPath = window.location.pathname;
        // Check if the current path contains 'public' or 'testnet'
        if (currentPath === "/public" || currentPath === "/testnet") {
            const newPath = `/${network}`;
            router.push(newPath);
        } else if (
            currentPath.includes("/public/") ||
            currentPath.includes("/testnet/")
        ) {
            // Construct the new path with updated network segment
            const newPath = `/${network}${currentPath.substring(
                currentPath.indexOf("/", 1)
            )}`;
            router.push(newPath);
        }
    };

    return (
        <div className="top-block">
            <div className="container nav relative">
                <Link href="/" className="logo" style={{ paddingTop: "7px" }}>
                    <Image
                        src="../montelibero-small-logo.png"
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
                        <Link href={"/" + net + "/assets"}>
                            {theme === "day" ? (
                                <span
                                    style={{ marginTop: "-6px", color: "#333" }}
                                >
                                    {" "}
                                    Assets
                                </span>
                            ) : (
                                <span style={{ marginTop: "-6px" }}>
                                    {" "}
                                    Assets
                                </span>
                            )}
                        </Link>
                    </div>
                    <div
                        className="top-menu-block right"
                        style={{ float: "right" }}
                    >
                        <div className="dropdown" ref={dropdownRef}>
                            <div
                                className={
                                    theme === "day"
                                        ? "dropdown-header-light"
                                        : "dropdown-header"
                                }
                                onClick={toggleDropdown}
                            >
                                <span
                                    className={
                                        theme === "day"
                                            ? "network-text-light"
                                            : "network-text"
                                    }
                                >
                                    Network{" "}
                                </span>
                                {theme !== "day" ? (
                                    <span className={`dropdown-selected`}>
                                        {net}
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            marginInline: "5px",
                                            color: "#666",
                                        }}
                                    >
                                        {net}
                                    </span>
                                )}
                                <span
                                    className={`${
                                        isOpen
                                            ? theme === "day"
                                                ? "dd-toggle-light visible"
                                                : "dd-toggle visible"
                                            : theme === "day"
                                            ? "dd-toggle-light"
                                            : "dd-toggle"
                                    }`}
                                ></span>
                            </div>
                            {isOpen && (
                                <div
                                    className={
                                        theme === "day"
                                            ? "dropdown-menu-light"
                                            : "dropdown-menu"
                                    }
                                >
                                    <div
                                        className={
                                            theme === "night"
                                                ? `dropdown-item ${
                                                      net === "testnet" &&
                                                      "selected"
                                                  }`
                                                : `dropdown-item-light ${
                                                      net === "testnet" &&
                                                      "selected"
                                                  }`
                                        }
                                        onClick={() => handleSelect("public")}
                                    >
                                        public
                                    </div>
                                    <div
                                        className={
                                            theme === "night"
                                                ? `dropdown-item ${
                                                      net === "public" &&
                                                      "selected"
                                                  }`
                                                : `dropdown-item-light ${
                                                      net === "public" &&
                                                      "selected"
                                                  }`
                                        }
                                        onClick={() => handleSelect("testnet")}
                                    >
                                        testnet
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
