"use client";

import React, { FC } from "react";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { Footer, Header } from "@/widgets";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  const { theme } = useStore(
    useShallow((state) => ({
      theme: state.theme,
    }))
  );

  return (
    <html lang="en" data-theme={theme}>
      <head>
      </head>
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

export default RootLayout;