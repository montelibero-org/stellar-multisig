"use client";

import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState("night");

    useEffect(() => {
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            localStorage.setItem("theme", "night");
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    return {
        theme,
        setTheme,
    };
};

export default useTheme;
