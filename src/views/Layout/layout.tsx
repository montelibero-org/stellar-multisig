"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";
import { usePathname } from "next/navigation";
import axios from "axios";
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
  const [commitHash] = useState(process.env.NEXT_PUBLIC_COMMIT_HASH ?? "");
  const pathname = usePathname();
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

  // Устанавливаем состояние, когда доступен объект window
  useEffect(() => {
    setIsWindowDefined(typeof window !== "undefined");
    if (isWindowDefined) {
      // Логика для получения темы, сети и аккаунтов из localStorage
      if (localStorage.getItem("theme")) {
        const theme = localStorage.getItem("theme")!;
        if (theme === "day" || theme === "night") {
          setTheme(theme);
        } else {
          console.error(`Недопустимое значение темы: ${theme}`);
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

  // Проверка версии при изменении пути
  useEffect(() => {
    const fetchLatestCommitHash = async () => {
      if (!isDomainAllowed()) {
        console.warn("Неавторизованный домен. Пропуск проверки хеша коммита.");
        return;
      }

      if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
        console.warn(
          "Вы не указали переменную окружения NEXT_PUBLIC_GITHUB_TOKEN. Пропуск проверки хеша коммита."
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

        if (lastFetchedHash && latestHash !== lastFetchedHash) {
          console.log("Версия изменена. Проверьте новую версию.");
          // Здесь можно показать уведомление или выполнить другие действия, без перезагрузки страницы.
          // Например, можно отобразить модальное окно с предупреждением или обновить состояние.
        }

        setLastFetchedHash(latestHash);
      } catch (error) {
        console.warn("Ошибка при получении хеша коммита:", error);
      }
    };

    fetchLatestCommitHash();
  }, [pathname, lastFetchedHash]); // Теперь запрос выполняется при изменении пути

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
        {/* {showPopup && <PopupVersionTheSite />} */}
        <Modals />
      </body>
    </html>
  );
};

export default PageLayout;
