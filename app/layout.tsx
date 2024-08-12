
import React, { FC } from "react";
import Layout from "@/pages/Layout/layout"
import "./globals.css";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return <Layout>{children}</Layout>;
  // test
};

export default RootLayout;