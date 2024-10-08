import { IFlag } from "../../../shared/FlagSelector";

export const setFlagsData: IFlag[] = [
  { id: 0, name: "Authorization required", points: 1 },
  { id: 1, name: "Authorization revocable", points: 2 },
  { id: 2, name: "Authorization immutable", points: 4 },
  { id: 3, name: "Authorization clawback enabled", points: 8 },
];

export const clearFlagsData: IFlag[] = [
  { id: 0, name: "Authorization required", points: 1 },
  { id: 1, name: "Authorization revocable", points: 2 },
  { id: 2, name: "Authorization clawback enabled", points: 8 },
];
