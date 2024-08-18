"use client";

import "./header.scss";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { IAccount } from "@/shared/types";
import AccountItem from "./AccountItem";
import { collapseAccount } from "@/pages/public/account/publicnet";

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
    useShallow((state) => ({
      net: state.net,
      setNet: state.setNet,
      setAccounts: state.setAccounts,
      theme: state.theme,
      accounts: state.accounts,
      setIsOpenAddAccountModal: state.setIsOpenAddAccountModal,
      isOpenAddAccountModal: state.isOpenAddAccountModal,
      isAuth: state.isAuth,
    }))
  );
  const [isOpenNet, setIsOpenNet] = useState<boolean>(false);
  const [isOpenAccount, setIsOpenAccount] = useState<boolean>(false);
  const dropdownRefNet = useRef<HTMLDivElement>(null);
  const dropdownRefAccount = useRef<HTMLDivElement>(null);
  const dropdownRefAddAccount = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpenAddAccountModal) {
        return;
      }

      if (
        dropdownRefNet.current &&
        !dropdownRefNet.current.contains(event.target as Node)
      ) {
        setIsOpenNet(false);
      }

      if (
        dropdownRefAccount.current &&
        !dropdownRefAccount.current.contains(event.target as Node)
      ) {
        setIsOpenAccount(false);
      }

      if (
        dropdownRefAddAccount.current &&
        !dropdownRefAddAccount.current.contains(event.target as Node)
      ) {
        setIsOpenAddAccountModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenAddAccountModal, setIsOpenAddAccountModal]);

  const toggleDropdownNet = () => setIsOpenNet(!isOpenNet);
  const toggleDropdownAccount = () => setIsOpenAccount(!isOpenAccount);

  const handleSelectNet = (network: string) => {
    setNet(network);
    localStorage.setItem('net', network);
    setIsOpenNet(false);

    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split('/').filter(Boolean);

    let newPath: string;

    if (pathSegments[0] === 'public' || pathSegments[0] === 'testnet') {
      newPath = `/${network}${pathSegments.length > 1 ? '/' + pathSegments.slice(1).join('/') : ''}`;
    } else {
      newPath = `/${network}${currentUrl.pathname}`;
    }

    const newUrl = `${newPath}${currentUrl.search}`;

    router.push(newUrl);
  };

  // const handleSelectAccount = (account: IAccount) => {
  //   setAccounts([...accounts, account]);
  //   const accountLS = JSON.parse(localStorage.getItem("accounts")!) as
  //     | IAccount[]
  //     | null;
  //   localStorage.setItem(
  //     "accounts",
  //     JSON.stringify([account, ...(accountLS ?? [])])
  //   );
  //   setIsOpenAccount(false);
  // };

  const logout = () => {
    // Удаляем текущий аккаунт
    const updatedAccounts = accounts.filter((account) => !account.isCurrent);

    // Определяем новый текущий аккаунт
    const newCurrentAccount = updatedAccounts[0];

    // Если новый текущий аккаунт существует, устанавливаем его как текущий
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
                      >
                        <span
                          onClick={() => {
                            setIsOpenAddAccountModal(true);
                            setIsOpenAccount(false);
                          }}
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
                      >
                        <span onClick={logout}>Logout</span>
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
                  <span className={`dropdown-selected`}>{net === "public" ? "Public" : "Testnet"}</span>
                ) : (
                  <span
                    style={{
                      marginInline: "5px",
                      color: "#666",
                    }}
                  >
                    {net === "public" ? "Public" : "Testnet"}
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
                    Public
                  </div>
                  <div
                    className={`dropdown-item${
                      theme === "night" ? "" : "-light"
                    } ${net !== "testnet" ? "selected" : ""}`}
                    onClick={() => handleSelectNet("testnet")}
                  >
                    Testnet
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
