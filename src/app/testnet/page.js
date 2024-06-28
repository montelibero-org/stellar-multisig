"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "@/components/Search";
import MainLayout from "@/components/layouts";
import { usePublic } from "@/context/net";
import { useRouter } from "next/navigation";
export default function Home() {
    const [net, setNet] = usePublic();
    return (
        <MainLayout>
            <SearchBar setParNet={setNet} />
        </MainLayout>
    );
}

