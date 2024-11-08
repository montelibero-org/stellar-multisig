import { Information } from "@/shared/types/information";

export interface InformationState {
  information: Information;
  
}

export interface InformationActions {
  setInformation: (information: Information) => void;
}

export interface IInformationSlice
  extends InformationState,
    InformationActions {}

export default IInformationSlice;
