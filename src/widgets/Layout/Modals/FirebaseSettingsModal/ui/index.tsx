"use client";

import { FC, useState, useEffect } from "react";
import "./index.scss";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { ModalLayout } from "@/features";
import InputField from "@/entities/Layout/Modals/FirebaseSettingsModal/InputField";
import React from "react";
import { FirebaseOptions } from "firebase/app";

type FirebaseType = "Default" | "Custom";

const FirebaseSettingsModal: FC = () => {
  const {
    theme,
    isOpenFirebaseSettingsModal,
    setIsOpenFirebaseSettingsModal,
    initializeFirebase,
    firebaseApp,
  } = useStore(useShallow((state) => state));

  const [currentFirebase, setCurrentFirebase] =
    useState<FirebaseType>("Default");

  const [formValues, setFormValues] = useState<FirebaseOptions>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });

  const changeFormValue = (key: keyof FirebaseOptions, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    window.localStorage.setItem("Firebase-" + key, value);
  };

  useEffect(() => {
    console.log(formValues);
    initializeFirebase(formValues);
    console.log(firebaseApp);
  }, [formValues]);

  useEffect(() => {
    setFormValues({
      apiKey: window.localStorage.getItem("Firebase-apiKey") ?? "",
      authDomain: window.localStorage.getItem("Firebase-authDomain") ?? "",
      projectId: window.localStorage.getItem("Firebase-projectId") ?? "",
      storageBucket:
        window.localStorage.getItem("Firebase-storageBucket") ?? "",
      messagingSenderId:
        window.localStorage.getItem("Firebase-messagingSenderId") ?? "",
      appId: window.localStorage.getItem("Firebase-appId") ?? "",
    });
    setCurrentFirebase(
      (window.localStorage.getItem(
        "Firebase-currentFirebase"
      ) as FirebaseType) ?? "Default"
    );
  }, []);

  useEffect(() => {
    if (currentFirebase === "Custom") {
      setFormValues({
        apiKey: window.localStorage.getItem("Firebase-apiKey") ?? "",
        authDomain: window.localStorage.getItem("Firebase-authDomain") ?? "",
        projectId: window.localStorage.getItem("Firebase-projectId") ?? "",
        storageBucket:
          window.localStorage.getItem("Firebase-storageBucket") ?? "",
        messagingSenderId:
          window.localStorage.getItem("Firebase-messagingSenderId") ?? "",
        appId: window.localStorage.getItem("Firebase-appId") ?? "",
      });
    } else {
      initializeFirebase({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });

      console.log(firebaseApp);
    }
  }, [currentFirebase]);

  return (
    <ModalLayout
      isOpenModal={isOpenFirebaseSettingsModal}
      setIsOpenModal={setIsOpenFirebaseSettingsModal}
    >
      <center>
        <h3>Change Firebase</h3>
      </center>
      <form>
        <div
          className={
            theme === "night"
              ? "modal-container-content-title"
              : "modal-container-content-title-light"
          }
        >
          <div className="tabs">
            <div className="tabs-header">
              {["Default", "Custom"].map((type) => (
                <React.Fragment key={type}>
                  <Link
                    onClick={() => {
                      setCurrentFirebase(type as FirebaseType);
                      window.localStorage.setItem(
                        "Firebase-currentFirebase",
                        type
                      );
                    }}
                    href="#"
                    className={
                      `tabs-item condensed ` +
                      (currentFirebase === type ? "selected " : "")
                    }
                    style={{ marginInline: "10px" }}
                  >
                    <span
                      className="tabs-item-text"
                      style={{ paddingInline: "4px" }}
                    >
                      {type}
                    </span>
                  </Link>
                  {type === "Default" &&
                    formValues.authDomain ===
                      process.env.NEXT_PUBLIC_AUTH_DOMAIN && (
                      <i
                        title={`Use only for ${process.env.NEXT_PUBLIC_AUTH_DOMAIN}`}
                        className="fa-solid fa-triangle-exclamation"
                        style={{ color: "#08b5e5" }}
                      ></i>
                    )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        {currentFirebase === "Custom" && (
          <div className="flex modal-container-content-form">
            <InputField
              title={"API Key"}
              placeholder={"API Key"}
              value={formValues.apiKey || ""}
              setValue={(value) => changeFormValue("apiKey", value)}
            />
            <InputField
              title={"Auth Domain"}
              placeholder={"Auth Domain"}
              value={formValues.authDomain || ""}
              setValue={(value) => changeFormValue("authDomain", value)}
            />
            <InputField
              title={"Project ID"}
              placeholder={"Project ID"}
              value={formValues.projectId || ""}
              setValue={(value) => changeFormValue("projectId", value)}
            />
            <InputField
              title={"Storage Bucket"}
              placeholder={"Storage Bucket"}
              value={formValues.storageBucket || ""}
              setValue={(value) => changeFormValue("storageBucket", value)}
            />
            <InputField
              title={"Messaging Sender ID"}
              placeholder={"Messaging Sender ID"}
              value={formValues.messagingSenderId || ""}
              setValue={(value) => changeFormValue("messagingSenderId", value)}
            />
            <InputField
              title={"App ID"}
              placeholder={"App ID"}
              value={formValues.appId || ""}
              setValue={(value) => changeFormValue("appId", value)}
            />
            <InputField
              title={"Measurement ID"}
              placeholder={"Measurement ID"}
              value={formValues.measurementId || ""}
              setValue={(value) => changeFormValue("measurementId", value)}
            />
          </div>
        )}
      </form>
    </ModalLayout>
  );
};

export default FirebaseSettingsModal;
