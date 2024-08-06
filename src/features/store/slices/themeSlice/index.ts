import { IThemeSlice } from "@/shared/types/index";
import { StateCreator } from "zustand";

export const themeSlice: StateCreator<
    IThemeSlice,
    [["zustand/immer", never]],
    [],
    IThemeSlice
> = (set /*, get*/) => {
    const theme = "night";
    const setTheme = (theme: string) => {
        set({ theme: theme });
        localStorage.setItem("theme", theme);
    };

    return {
        theme,
        setTheme,
    };
};
