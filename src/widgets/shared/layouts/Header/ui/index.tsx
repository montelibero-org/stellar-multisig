"use client";

import "@/shared/styles/dropdown/index.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { IAccount } from "@/shared/types";
import AccountItem from "./AccountItem";
import { collapseAccount } from "@/shared/helpers";

export const Header: FC = () => {
  const {
    net,
    setNet,
    theme,
    setAccounts,
    accounts,
    setIsOpenAddAccountModal,
    isOpenAddAccountModal,
    isAuth,
  } = useStore(
    useShallow((state) => state)
  );
  const [isOpenNet, setIsOpenNet] = useState<boolean>(false);
  const [isOpenAccount, setIsOpenAccount] = useState<boolean>(false);
  const dropdownRefNet = useRef<HTMLDivElement>(null);
  const dropdownRefAccount = useRef<HTMLDivElement>(null);
  const dropdownRefAddAccount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpenAddAccountModal) return;

      if (
        dropdownRefNet.current &&
        !dropdownRefNet.current.contains(event.target as Node)
      )
        setIsOpenNet(false);

      if (
        dropdownRefAccount.current &&
        !dropdownRefAccount.current.contains(event.target as Node)
      )
        setIsOpenAccount(false);

      if (
        dropdownRefAddAccount.current &&
        !dropdownRefAddAccount.current.contains(event.target as Node)
      )
        setIsOpenAddAccountModal(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenAddAccountModal, setIsOpenAddAccountModal]);

  const toggleDropdownNet = () => setIsOpenNet(!isOpenNet);
  const toggleDropdownAccount = () => setIsOpenAccount(!isOpenAccount);

  const handleSelectNet = (network: "public" | "testnet") => {
    setNet(network);
    localStorage.setItem("net", network);
    setIsOpenNet(false);

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split("/");

    if (pathSegments[1] === "public" || pathSegments[1] === "testnet") {
      pathSegments[1] = network;
    }

    const newUrl = `${url.origin}${pathSegments.join("/")}${url.search}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const logout = () => {
    const updatedAccounts = accounts.filter((account) => !account.isCurrent);
    const newCurrentAccount = updatedAccounts[0] || updatedAccounts[1];
    if (newCurrentAccount) {
      setAccounts(
        updatedAccounts.map((account) => ({
          ...account,
          isCurrent: account.id === newCurrentAccount.id,
        }))
      );
    } else {
      setAccounts(updatedAccounts);
    }
  };

  const addAccountOpen = () => {
    setIsOpenAddAccountModal(true);
    setIsOpenAccount(false);
  }

  return (
    <div className="top-block">
      <div className="container nav relative">
        <Link href="/" className="logo" style={{ paddingTop: "7px" }}>
          <Image
            src="../montelibero-small-logo.png"
            alt="Montelibero Logo"
            className="dark:invert"
            width={30}
            height={30}
            priority
          />{" "}
          &nbsp; MTL Stellar Multisig
        </Link>
        <div className="nav-menu-dropdown false">
          <div className="main-menu top-menu-block">
            <Link href={"/" + net + "/assets"}>
              {theme === "day" ? (
                <span style={{ marginTop: "-6px", color: "#333" }}>
                  {" "}
                  Assets
                </span>
              ) : (
                <span style={{ marginTop: "-6px" }}> Assets</span>
              )}
            </Link>
          </div>
          {isAuth ? (
            <div className="top-menu-block right" style={{ float: "right" }}>
              <div className="dropdown" ref={dropdownRefAccount}>
                <div
                  className={
                    theme === "day"
                      ? "dropdown-header-light"
                      : "dropdown-header"
                  }
                  onClick={toggleDropdownAccount}
                >
                  {theme !== "day" ? (
                    <span className="dropdown-selected">
                      {collapseAccount(
                        accounts
                          .filter(
                            (account: IAccount) => account.isCurrent === true
                          )
                          .filter((account: IAccount) => account.net === net)
                          .map((account: IAccount) => account.accountID)[0]
                      )}
                    </span>
                  ) : (
                    <span
                      style={{
                        marginInline: "5px",
                        color: "#666",
                      }}
                    >
                      {collapseAccount(
                        accounts
                          .filter(
                            (account: IAccount) => account.isCurrent === true
                          )
                          .filter((account: IAccount) => account.net === net)
                          .map((account: IAccount) => account.accountID)[0]
                      )}
                    </span>
                  )}
                  <span
                    className={`${
                      isOpenAccount
                        ? theme === "day"
                          ? "dd-toggle-light visible"
                          : "dd-toggle visible"
                        : theme === "day"
                        ? "dd-toggle-light"
                        : "dd-toggle"
                    }`}
                  ></span>
                </div>
                {isOpenAccount && (
                  <div
                    className={
                      theme === "day" ? "dropdown-menu-light" : "dropdown-menu"
                    }
                  >
                    <ul style={{ margin: "0" }}>
                      <div
                        key={
                          accounts
                            .filter(
                              (account: IAccount) => account.isCurrent === true
                            )
                            .map((account: IAccount) => account.id)[0]
                        }
                      >
                        <AccountItem
                          id={
                            accounts
                              .filter(
                                (account: IAccount) =>
                                  account.isCurrent === true
                              )
                              .filter(
                                (account: IAccount) => account.net === net
                              )
                              .map((account: IAccount) => account.accountID)[0]
                          }
                          isOpenAccount={isOpenAccount}
                          setIsOpenAccount={setIsOpenAccount}
                          isMain={false}
                          account={
                            accounts
                              .filter(
                                (account: IAccount) =>
                                  account.isCurrent === true
                              )
                              .filter(
                                (account: IAccount) => account.net === net
                              )
                              .map((account: IAccount) => account)[0]
                          }
                        />
                      </div>
                      <hr />
                      {accounts
                        .filter((account: IAccount) => account.net === net)
                        .filter((account: IAccount) => !account.isMultiSig)
                        .filter((account: IAccount) => !account.isCurrent)
                        .map((account: IAccount, index: number) => (
                          <div key={index}>
                            <AccountItem
                              key={index}
                              id={account.accountID}
                              isOpenAccount={isOpenAccount}
                              setIsOpenAccount={setIsOpenAccount}
                              isMain={!account.isCurrent}
                              account={account}
                            />
                          </div>
                        ))}

                      <hr />
                      {accounts
                        .filter((account: IAccount) => account.net === net)
                        .filter((account: IAccount) => account.isMultiSig)
                        .filter((account: IAccount) => !account.isCurrent)
                        .map((account: IAccount, index: number) => (
                          <div key={index}>
                            <AccountItem
                              key={index}
                              id={account.accountID}
                              isOpenAccount={isOpenAccount}
                              setIsOpenAccount={setIsOpenAccount}
                              isMain={!account.isCurrent}
                              account={account}
                            />
                          </div>
                        ))}

                      <hr />
                      <li
                        className={
                          theme === "night"
                            ? `dropdown-item selected`
                            : `dropdown-item-light selected`
                        }
                        style={{ textAlign: "center" }}
                        onClick={addAccountOpen}
                      >
                        <span
                        >
                          Add account
                        </span>
                      </li>
                      <li
                        className={
                          theme === "night"
                            ? `dropdown-item selected`
                            : `dropdown-item-light selected`
                        }
                        style={{ textAlign: "center" }}
                        onClick={logout}
                      >
                        <span>Logout</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="top-menu-block right" style={{ float: "right" }}>
              <div
                className={
                  theme === "day" ? "dropdown-header-light" : "dropdown-header"
                }
              >
                <span
                  className="dropdown-selected"
                  onClick={() => setIsOpenAddAccountModal(true)}
                  style={{ cursor: "pointer", marginTop: "-4px" }}
                >
                  Login
                </span>
              </div>
            </div>
          )}
          <div className="top-menu-block right" style={{ float: "right" }}>
            <div className="dropdown" ref={dropdownRefNet}>
              <div
                className={
                  theme === "day" ? "dropdown-header-light" : "dropdown-header"
                }
                onClick={toggleDropdownNet}
              >
                <span
                  className={
                    theme === "day" ? "network-text-light" : "network-text"
                  }
                >
                  Network{" "}
                </span>
                {theme !== "day" ? (
                  <span className={`dropdown-selected`}>
                    {net === "public" ? "public" : "testnet"}
                  </span>
                ) : (
                  <span
                    style={{
                      marginInline: "5px",
                      color: "#666",
                    }}
                  >
                    {net === "public" ? "public" : "testnet"}
                  </span>
                )}
                <span
                  className={`${
                    isOpenNet
                      ? theme === "day"
                        ? "dd-toggle-light visible"
                        : "dd-toggle visible"
                      : theme === "day"
                      ? "dd-toggle-light"
                      : "dd-toggle"
                  }`}
                ></span>
              </div>
              {isOpenNet && (
                <div
                  className={
                    theme === "day" ? "dropdown-menu-light" : "dropdown-menu"
                  }
                >
                  <div
                    className={`dropdown-item${
                      theme === "night" ? "" : "-light"
                    } ${net !== "public" ? "selected" : ""}`}
                    onClick={() => handleSelectNet("public")}
                  >
                    public
                  </div>
                  <div
                    className={`dropdown-item${
                      theme === "night" ? "" : "-light"
                    } ${net !== "testnet" ? "selected" : ""}`}
                    onClick={() => handleSelectNet("testnet")}
                  >
                    testnet
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
