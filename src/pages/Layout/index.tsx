"use client"

import { FC, useEffect } from "react";
import { useStore } from "@/features/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";

type Props = {
    children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
    const { theme, setTheme, setNet } = useStore(
        useShallow((state) => ({
            theme: state.theme,
            setTheme: state.setTheme,
            setNet: state.setNet
        }))
    );

    useEffect(() => {
        if (localStorage.getItem("theme")) setTheme(localStorage.getItem("theme")!);
        if (localStorage.getItem("net")) setNet(localStorage.getItem("net")!);
    }, [setTheme, setNet]);

    return (
        <html lang="en" data-theme={theme}>
            <body>
                <main className="flex min-h-screen flex-col">
                    <hr className="blue-ribbon" />
                    <Header />
                    {children}
                    <Footer />
                </main>
            </body>
        </html>
    );
};

export default PageLayout;
