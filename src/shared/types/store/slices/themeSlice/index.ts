export interface ThemeState {
  theme: string | null
}

export interface ThemeActions {
  setTheme: (theme: string) => void
}

interface IThemeSlice extends ThemeState, ThemeActions {}

export default IThemeSlice