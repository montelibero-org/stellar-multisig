"use client";
import React from "react";
import SearchBar from "@/components/Search";
import MainLayout from "@/components/layouts";
import { usePublic } from "@/context/net";
export default function Home() {
    const [net, setNet] = usePublic();
    return (
        <MainLayout>
            <SearchBar setParNet={setNet} />
        </MainLayout>
    );
}

