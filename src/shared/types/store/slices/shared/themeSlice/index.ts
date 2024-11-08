export interface ThemeState {
  theme: "day" | "night" | null
}

export interface ThemeActions {
  setTheme: (theme: "day" | "night") => void
}

interface IThemeSlice extends ThemeState, ThemeActions {}

export default IThemeSlice
