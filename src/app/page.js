"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/Search";
import MainLayout from "@/components/layouts";
import { usePublic } from "@/context/net";
export default function Home() {
    const [net, setNet] = usePublic();
    useEffect(() => {
        const currentPath = window.location.pathname;
        if(currentPath.includes('/public/')) {
            setNet('public')
        } else if (currentPath.includes('/testnet/')) {
            setNet('testnet')
        }
    })
    return (
        <MainLayout>
            <SearchBar setParNet={setNet} />
        </MainLayout>
    );
}

