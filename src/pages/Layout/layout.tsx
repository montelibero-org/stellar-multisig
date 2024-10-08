"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/features/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";
import AddAccountModal from "@/widgets/shared/layouts/Header/ui/AddAccountModal";
import Head from "next/head";

type Props = {
  children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
  const [isWindowDefined, setIsWindowDefined] = useState(false);

  const {
    theme,
    setTheme,
    setNet,
    setAccounts,
    accounts,
    isOpenAddAccountModal,
    setIsAuth,
    net,
  } = useStore(useShallow((state) => state));

  useEffect(() => {
    setIsWindowDefined(typeof window !== "undefined");
    if (isWindowDefined) {
      if (localStorage.getItem("theme")) {
        setTheme(localStorage.getItem("theme")!);
      }

      if (localStorage.getItem("net")) {
        setNet(localStorage.getItem("net")!);
      }

      if (localStorage.getItem("accounts")) {
        setAccounts(JSON.parse(localStorage.getItem("accounts")!));
      }
    }
  }, [isWindowDefined, setTheme, setNet, setAccounts]);

  useEffect(() => {
    setIsAuth(
      accounts
        .filter((account) => account.net === net)
        .filter((account) => account.isCurrent).length > 0
    );
  }, [accounts, net, setIsAuth]);

  const themeLS: string | undefined | null = isWindowDefined
    ? window.localStorage.getItem("theme")
      ? window.localStorage.getItem("theme")
      : "night"
    : "";

  if (!isWindowDefined) {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>MTL Stellar Multisig</title>
        </Head>
        <body></body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme={!theme || themeLS}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="commit-hash"
          content={process.env.NEXT_PUBLIC_COMMIT_HASH || ""}
        />
        <title>MTL Stellar Multisig</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"/>
      </head>
      <body>
        <main
          className={`flex min-h-screen flex-col ${
            isOpenAddAccountModal && "is-open-add-account-modal"
          }`}
        >
          <hr className="blue-ribbon" />
          <Header />
          {children}
          <Footer />
        </main>
        {isOpenAddAccountModal && <AddAccountModal />}
      </body>
    </html>
  );
};

export default PageLayout;
