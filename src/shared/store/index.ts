import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import {
  netSlice,
  themeSlice,
  accountSlice,
  buildTxJSONSlice,
  serverSlice,
  transactionsFromFirebaseSlice,
  buildErrorsSlice,
  collapsesBlocksSlice,
  informationSlice,
  modalsSlice,
} from "./slices";
import { Store } from "@/shared/types";
import { firebaseSettingsSlice } from "./slices/firebase/firebaseSettingsSlice";

export const useStore = create<Store>()(
  devtools(
    subscribeWithSelector(
      immer((...a) => ({
        ...netSlice(...a),
        ...themeSlice(...a),
        ...accountSlice(...a),
        ...buildTxJSONSlice(...a),
        ...serverSlice(...a),
        ...transactionsFromFirebaseSlice(...a),
        ...buildErrorsSlice(...a),
        ...collapsesBlocksSlice(...a),
        ...informationSlice(...a),
        ...modalsSlice(...a),
        ...firebaseSettingsSlice(...a),
      }))
    )
  )
);
