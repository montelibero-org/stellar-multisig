"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";
import { usePathname } from "next/navigation";
import { PopupVersionTheSite } from "@/widgets/shared/ui/PopupVersionTheSite";
import axios from "axios";
import { cacheConfig } from "@/shared/configs";
import Modals from "@/widgets/Layout/Modals";

type Props = {
  children: React.ReactNode;
};
const allowedDomains = [{ domain: "stellar-multisig.montelibero.org" }];

const isDomainAllowed = () => {
  const currentDomain = window.location.hostname;
  return allowedDomains.some((entry) => entry.domain === currentDomain);
};

const PageLayout: FC<Props> = ({ children }) => {
  const [isWindowDefined, setIsWindowDefined] = useState<boolean>(false);

  const [commitHash, setCommitHash] = useState(
    process.env.NEXT_PUBLIC_COMMIT_HASH ?? ""
  );
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [lastFetchedHash, setLastFetchedHash] = useState<string | null>(null);
  const {
    theme,
    setTheme,
    setNet,
    setAccounts,
    accounts,
    isOpenAddAccountModal,
    setIsAuth,
    net,
    setServer,
    setNetwork,
    initializeFirebase,
  } = useStore(useShallow((state) => state));

  useEffect(() => {
    setIsWindowDefined(typeof window !== "undefined");
    if (isWindowDefined) {
      if (localStorage.getItem("theme")) {
        const theme = localStorage.getItem("theme")!;
        if (theme === "day" || theme === "night") {
          setTheme(theme);
        } else {
          console.error(`Invalid theme value: ${theme}`);
        }
      }

      const netValue = localStorage.getItem("net");
      if (netValue === "testnet" || netValue === "public") {
        setNet(netValue);
      }

      if (localStorage.getItem("accounts")) {
        setAccounts(JSON.parse(localStorage.getItem("accounts")!));
      }

      if (pathname) {
        setNet(pathname.includes("testnet") ? "testnet" : "public");
      }
    }
  }, [isWindowDefined, setTheme, setNet, setAccounts, pathname]);

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

  useEffect(() => {
    setServer(net);
    setNetwork(net);
  }, [net]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const fetchLatestCommitHash = async () => {
      if (!isDomainAllowed()) {
        console.warn("Unauthorized domain. Skipping commit hash fetch.");
        return;
      }

      if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
        console.warn(
          "You have not set the NEXT_PUBLIC_GITHUB_TOKEN environment variable. Skipping commit hash fetch."
        );
        return;
      }

      try {
        const response = await axios.get(
          "https://api.github.com/repos/montelibero-org/stellar-multisig/commits",
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
          }
        );
        const latestHash = response.data[0].sha.substring(0, 7);
        setCommitHash(latestHash);

        if (lastFetchedHash && latestHash !== lastFetchedHash) {
          console.log("Version changed");
          console.log(latestHash);
          console.log(lastFetchedHash);
          if (timeoutId) clearTimeout(timeoutId);

          timeoutId = setTimeout(() => {
            setShowPopup(true);
          }, 60000);
        }
        setLastFetchedHash(latestHash);
      } catch (error) {
        console.warn("Error fetching commit hash (maybe, your token is wrong):", error);
      }
    };

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(
        fetchLatestCommitHash,
        cacheConfig.checkOfCurrentVersionDurationMs
      );
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchLatestCommitHash();
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    fetchLatestCommitHash();
    startPolling();

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastFetchedHash]);

  useEffect(() => {
    if (
      window.localStorage.getItem("Firebase-currentFirebase") === "Default" ||
      !window.localStorage.getItem("Firebase-currentFirebase")
    ) {
      initializeFirebase({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
    } else {
      initializeFirebase({
        apiKey: window.localStorage.getItem("Firebase-apiKey")!,
        authDomain: window.localStorage.getItem("Firebase-authDomain")!,
        projectId: window.localStorage.getItem("Firebase-projectId")!,
        storageBucket: window.localStorage.getItem("Firebase-storageBucket")!,
        messagingSenderId: window.localStorage.getItem(
          "Firebase-messagingSenderId"
        )!,
        appId: window.localStorage.getItem("Firebase-appId")!,
      });
    }
  }, []);

  if (!isWindowDefined) {
    return (
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>MTL Stellar Multisig</title>
        </head>
        <body></body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme={!theme || themeLS}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="commit-hash" content={commitHash} />
        <title>MTL Stellar Multisig</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
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
        {showPopup && <PopupVersionTheSite />}
        <Modals />
      </body>
    </html>
  );
};

export default PageLayout;