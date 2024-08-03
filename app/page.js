"use client";
import React, { useEffect } from "react";
import SearchBar from "@/components/Search";
import MainLayout from "@/components/layouts";
import { usePublic } from "@/context/net";
import { useRouter } from "next/navigation";
import useTheme from "@/hook/theme";
export default function Home() {
    const { theme, setTheme } = useTheme();
    const [net, setNet] = usePublic();
    const route = useRouter();
    useEffect(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("/public/")) {
            setNet("public");
        } else if (currentPath.includes("/testnet/")) {
            setNet("testnet");
        } else {
            setNet("public");
            route.replace("/public");
        }
    });
    return (
        <MainLayout>
            <SearchBar />
        </MainLayout>
    );
}
