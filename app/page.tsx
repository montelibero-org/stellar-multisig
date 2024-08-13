"use client";
import React, { useEffect } from "react";
import {MainLayout, SearchBar} from "@/widgets";
import { useRouter } from "next/navigation";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
export default function Home() {
    const {setNet} = useStore(useShallow((state) => ({setNet: state.setNet})));
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