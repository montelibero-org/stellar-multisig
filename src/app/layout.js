"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import useTheme from "@/hook/theme";
import React, { useEffect } from "react";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    const { theme, setTheme } = useTheme();

    return (
        <html lang="en" data-theme={theme}>
            <body className={inter.className}>
                <main className="flex min-h-screen flex-col">
                    <div className="blue-ribbon"></div>
                    <Header />
                    {children}
                    <Footer setTheme={setTheme} />
                </main>
            </body>
        </html>
    );
}
