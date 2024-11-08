import { IThemeSlice } from "@/shared/types/index";
import { StateCreator } from "zustand";

const themeSlice: StateCreator<
    IThemeSlice,
    [["zustand/immer", never]],
    [],
    IThemeSlice
> = (set /*, get*/) => {
    const theme = "night";
    const setTheme = (theme: "day" | "night") => {
        set({ theme: theme });
        localStorage.setItem("theme", theme);
    };

    return {
        theme,
        setTheme,
    };
};

export default themeSlice
