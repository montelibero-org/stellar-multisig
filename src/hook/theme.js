"use client";

import { useEffect, useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState('night');
    useEffect(() => {
        const _theme = localStorage.getItem("theme");
        if(_theme) {
            setTheme(_theme);
        } else {
            localStorage.setItem('theme', 'night');
            setTheme('night');
        }
    }, []);

    const changeTheme = (value) => {
        setTheme(value);
    };

    return {
        theme: theme,
        setTheme: changeTheme,
    };
};

export default useTheme;
