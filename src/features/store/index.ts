import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { netSlice, themeSlice } from "@/features/store/slices";
import { Store } from "@/shared/types"

export const useStore = create<Store>()(
  devtools(
    subscribeWithSelector(
      immer((...a) => ({
        ...netSlice(...a),
        ...themeSlice(...a)
      }))
    )
  )
);