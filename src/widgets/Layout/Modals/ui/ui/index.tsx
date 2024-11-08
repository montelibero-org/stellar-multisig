import { useStore } from "@/shared/store";
import { AddAccountModal, FirebaseSettingsModal } from "@/widgets/Layout";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";

const Modals: FC = () => {
  const { isOpenAddAccountModal, isOpenFirebaseSettingsModal } = useStore(
    useShallow((state) => state)
  );

  if (isOpenAddAccountModal) {
    return <AddAccountModal />;
  } else if (isOpenFirebaseSettingsModal) {
    return <FirebaseSettingsModal />;
  } else {
    return null;
  }
};

export default Modals;
