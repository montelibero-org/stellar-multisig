"use client";

import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState("night");

    const changeTheme = (value) => {
        setTheme(value);
    };

    return {
        theme: theme,
        setTheme: changeTheme,
    };
};

export default useTheme;
