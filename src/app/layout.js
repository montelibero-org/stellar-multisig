"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import useTheme from "@/hook/theme";
import React from "react";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import PublicProvider from "@/context/net";
import ReduxProvider from '@/components/Provider';

const inter = Inter({ subsets: ["latin"] });

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
                    <main className="flex min-h-screen flex-col">
                        <div className="blue-ribbon"></div>
                        <Header />
                        {children}
                        <Footer setTheme={setTheme} />
                    </main>
                </PublicProvider>
                <ReduxProvider>
                    <main className="flex min-h-screen flex-col">
                        <div className="blue-ribbon"></div>
                        <Header />
                        {children}
                        <Footer setTheme={setTheme} />
                    </main>
                </ReduxProvider>
            </body>
        </html>
    );
}
