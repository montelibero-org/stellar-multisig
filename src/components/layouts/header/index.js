"use client";

import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePublic } from "@/context/net";

const Header = () => {
    const router = useRouter();
    const [net, setNet] = usePublic();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Function to handle click outside dropdown
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close dropdown if clicked outside
            }
        }

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on cleanup
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (network) => {
        setNet(network);
        localStorage.setItem("net", network); // Store the network in localStorage
        setIsOpen(false);

        const currentPath = window.location.pathname;
        console.log(currentPath);
        // Check if the current path contains 'public' or 'testnet'
        if ( currentPath == "/public" ||currentPath == "/testnet" ) {
            const newPath = `/${network}`;

            // Navigate to the new path
            router.push(newPath);
        } else if (currentPath.includes('/public/') || currentPath.includes('/testnet/')) {
            // Construct the new path with updated network segment
            const newPath = `/${network}${currentPath.substring(currentPath.indexOf('/', 1))}`;

            // Navigate to the new path
            router.push(newPath);
        }
    };

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
                        <Link href={"/"+net+"/assets"}>Assets</Link>
                    </div>
                    <div
                        className="top-menu-block right"
                        style={{
                            float: "right",
                        }}
                    >
                        <div className="dropdown" ref={dropdownRef}>
                            <div className="dropdown-header" onClick={toggleDropdown}>
                                Network <span className="dropdown-selected">{net}</span>
                                <span className={isOpen ? "dd-toggle" : "dd-toggle visible"} ></span>
                            </div>
                            {isOpen && (
                                <div className="dropdown-menu">
                                    <div className={`dropdown-item ${net === 'public' ? 'selected' : ''}`} onClick={() => handleSelect('public')}>public</div>
                                    <div className={`dropdown-item ${net === 'testnet' ? 'selected' : ''}`} onClick={() => handleSelect('testnet')}>testnet</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
