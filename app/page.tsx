"use client";
import React, { useEffect, FC } from "react";
import {MainLayout, SearchBar} from "@/widgets";
import { useRouter } from "next/navigation";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

const Home: FC = () => {
    const {setNet} = useStore(useShallow((state) => state));
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

export default Home
