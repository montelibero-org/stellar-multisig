"use client";
import "./globals.css";
import useTheme from "@/hook/theme";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import PublicProvider from "@/context/net";

export default function RootLayout({ children }) {
    const { theme, setTheme } = useTheme();
    return (
        <html lang="en" data-theme={theme}>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                var theme = localStorage.getItem('theme');
                                if (!theme) {
                                    theme = 'night';
                                    localStorage.setItem('theme', 'night');
                                }
                                document.documentElement.setAttribute('data-theme', theme);
                            })();
                        `,
                    }}
                />
            </head>
            <body>
                <PublicProvider>
                    <main className="flex min-h-screen flex-col">
                        <hr className="blue-ribbon" />
                        <Header theme={theme} setTheme={setTheme} />
                        {children}
                        <Footer theme={theme} setTheme={setTheme} />
                    </main>
                </PublicProvider>
            </body>
        </html>
    );
}
