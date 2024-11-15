"use client";

import { FC, useEffect, useRef } from "react";
import "./index.scss";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

type Props = {
  isOpenModal: boolean;
  setIsOpenModal: (condition: boolean) => void;
  children: React.ReactNode;
};

const ModalLayout: FC<Props> = ({ isOpenModal, setIsOpenModal, children }) => {
  const { theme } = useStore(useShallow((state) => state));
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return isOpenModal ? (
    <div className={theme === "night" ? "modal-container" : "modal-container-light"}>
      <div
        className={theme === "night" || theme === "day" ? "modal-container-content" : "modal-content-light"}
        ref={modalRef}
      >
                <span
          onClick={() => setIsOpenModal(false)}
          className={
            theme === "night"
              ? "add-account-container-content-close"
              : "add-account-container-content-close-light"
          }
          aria-label="Close"
        >
          <i
            className="fa-regular fa-circle-xmark"
            style={{
              fontSize: "2rem",
              color: theme === "night" ? "#08b5e5" : "#666",
            }}
          />
        </span>
        {children}
      </div>
    </div>
  ) : null;

};


export default ModalLayout;
