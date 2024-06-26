"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import useTheme from "@/hook/theme";
import React, { useEffect } from "react";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import PublicProvider, { usePublic } from "@/context/net";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const NetUpdater = () => {
    const [net, setNet] = usePublic();

    useEffect(() => {
        const handleRouteChange = () => {
            const segments = window.location.pathname.split('/');
            if (segments.includes('public')) {
                setNet('public');
            } else if (segments.includes('testnet')) {
                setNet('testnet');
            }
        };

        // Listen for route changes using popstate event
        window.addEventListener('popstate', handleRouteChange);

        // Check initial URL on mount
        handleRouteChange();

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, [setNet]);

    return null;
};

export default function RootLayout({ children }) {
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        const _theme = localStorage.getItem("theme");

        setTheme(_theme);
    }, []);

    return (
        <html lang="en" data-theme={theme}>
            <body className={inter.className}>
                <PublicProvider>
            <NetUpdater /> {/* Component to update net based on URL */}
                    <main className="flex min-h-screen flex-col">
                        <div className="blue-ribbon"></div>
                        <Header />
                        {children}
                        <Footer setTheme={setTheme} />
                    </main>
                </PublicProvider>
            </body>
        </html>
    );
}
