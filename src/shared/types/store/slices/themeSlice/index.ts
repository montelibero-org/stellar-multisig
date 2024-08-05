export type ThemeState = {
  theme: string
}

export type ThemeActions = {
  setTheme: (theme: string) => void
}

export interface IThemeSlice extends ThemeState, ThemeActions {}