export type BuildErrors = string[]

export interface BuildErrorsState {
  buildErrors: BuildErrors
}

export interface BuildErrorsActions {
  setBuildErrors: (update: (prevErrors: BuildErrors) => BuildErrors) => void
}

interface IBuildErrorsSlice extends BuildErrorsState, BuildErrorsActions {}

export default IBuildErrorsSlice
