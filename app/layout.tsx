"use client";

import React, { FC } from "react";
import Layout from "@/pages/Layout"
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default RootLayout;