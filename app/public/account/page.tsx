"use client";
import PublicNet from "./publicnet"; // Adjust the import path as needed
import StellarSdk from "stellar-sdk";
import { MainLayout } from "@/widgets";
import React, { FC, useEffect, useState } from "react";

const Page: FC = () => {
    const [href, setHref] = useState("");
    useEffect(() => setHref(window.location.href), []);
    const id = href.split("id=").pop();

    if (!StellarSdk.StrKey.isValidEd25519PublicKey(id)) {
        return (
                <MainLayout>
                    <div className="cotainer">
                        <div
                            className={`search error container narrow`}
                            style={{ padding: "20px" }}
                        >
                            <h2 className="text-overflow">
                                Search results for {id}
                            </h2>
                            <div>User ID not found or invalid.</div>
                        </div>
                    </div>
                </MainLayout>
        );
    }
    return <PublicNet id={id} />;
}

export default Page;