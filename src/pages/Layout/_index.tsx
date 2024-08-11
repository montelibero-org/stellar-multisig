import { FC, useEffect, useState } from "react";
import { useStore } from "@/features/store";
import { Footer, Header } from "@/widgets";
import { useShallow } from "zustand/react/shallow";

type Props = {
  children: React.ReactNode;
};

const PageLayout: FC<Props> = ({ children }) => {
  const [isWindowDefined, setIsWindowDefined] = useState(false);

  const { theme, setTheme, setNet } = useStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
      setNet: state.setNet,
    }))
  );

  useEffect(() => {
    setIsWindowDefined(typeof window !== 'undefined');
    if (isWindowDefined) {
      if (localStorage.getItem("theme")) setTheme(localStorage.getItem("theme")!);
      if (localStorage.getItem("net")) setNet(localStorage.getItem("net")!);
    }
  }, [setTheme, setNet, isWindowDefined]);

  const themeLS: string = isWindowDefined ? String(window.localStorage.getItem("theme")) : '';

  if (!isWindowDefined) {
    return <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="commit-hash" content={process.env.NEXT_PUBLIC_COMMIT_HASH || ""} />
        <title>Stellar Multisig</title>
        </head>
        <body>

        </body>
    </html>;
  }

  return (
    <html lang="en" data-theme={!theme || themeLS}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="commit-hash" content={process.env.NEXT_PUBLIC_COMMIT_HASH || ""} />
        <title>Stellar Multisig</title>
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

export default PageLayout;