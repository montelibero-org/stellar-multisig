
import React, { FC } from "react";
import Layout from "@/views/Layout/layout"
import "./(default)/globals.css";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default RootLayout;

// delete it
