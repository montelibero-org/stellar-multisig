"use client";

import { MainLayout, ShowTransactions } from "@/widgets";
import {
  getAccountIssuerInformation,
  getDomainInformation,
  getMainInformation,
} from "@/features/hooks";
import StellarSdk, { Transaction, TransactionBuilder } from "stellar-sdk";
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import "./public.css";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import {
  Balance,
  Information,
  Signer,
  DocumentInfo,
  Issuer,
  TransactionData,
  ISeqNumIsStale,
  DecodedTransactions,
} from "@/shared/types";
import { processKeys } from "@/shared/lib";
import BalanceItem from "@/views/account/(BalanceItem)";
import ignoredHomeDomains from "@/shared/configs/ignored-home-domains.json";
import { getAllTransactions } from "@/shared/api/firebase/firestore/Transactions";
import {
  checkSigner,
  collapseAccount,
  isSequenceNumberOutdated,
} from "@/shared/helpers";

export enum TransactionStatuses {
  signing = "Signing",
  submitted = "Submitted",
  completed = "Completed",
  canceled = "Canceled",
}

interface Props {
  ID: string;
}

const AccountInfo: FC<Props> = ({ ID }) => {
  const { net, accounts, network } = useStore(useShallow((state) => state));
  const [information, setInformation] = useState<Information>(
    {} as Information
  );
  const [secondInformation, setSecondInformation] = useState<Information>();
  const [seqNumsIsStales, setSeqNumsIsStales] = useState<ISeqNumIsStale[]>([]);
  const [decodedTransactions, setDecodedTransactions] =
    useState<DecodedTransactions>([]);
  const [exists, setExists] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState<number>(1);
  const [errorvalid, setErrorvalid] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVisibleHomeDomainInfo, setIsVisibleHomeDomainInfo] =
    useState<boolean>(true);
  const [isVisibleBuildTx, setIsVisibleBuildTx] = useState<boolean>(false);
  const [transactionsFromFirebase, setTransactionsFromFirebase] = useState<
    TransactionData[]
  >([]);

  useEffect(() => {
    if (
      information.signers &&
      information.signers.length > 0 &&
      (decodedTransactions === null || decodedTransactions.length > 0)
    ) {
      setIsLoading(false);
    }
  }, [information, decodedTransactions]);

  useEffect(() => {
    const checkAccount = async () => {
      const serverUrl =
        net === "testnet"
          ? "https://horizon-testnet.stellar.org"
          : "https://horizon.stellar.org";
      const server = new StellarSdk.Server(serverUrl);

      try {
        const secondInformation = await server.loadAccount(ID);
        setSecondInformation(secondInformation);
        setExists(true);
      } catch (e) {
        if (e instanceof StellarSdk.NotFoundError) {
          setExists(false);
          setErrorvalid(
            "Error: Account does not exist on the network. Make sure that you copied account address correctly and there was at least one payment to this address."
          );
        } else {
          console.error(e);
        }
      }
    };

    if (StellarSdk.StrKey.isValidEd25519PublicKey(ID)) {
      checkAccount();
    } else {
      setTimeout(() => {
        setExists(false);
      }, 2000);
      setErrorvalid(
        `"Cannot read properties of null (reading 'invalidAsset')" at ${ID}`
      );
    }
  }, [net, ID]);

  useEffect(() => {
    setIsVisibleBuildTx(checkSigner(accounts, information.signers));
  }, [accounts, information.signers]);

  useEffect(() => {
    setIsVisibleBuildTx(false);
  }, [ID]);

  useEffect(() => {
    const handler = async () => {
      if (ID != "") {
        const horizonInfo = await getMainInformation(ID as string);
        const accountIssuer = await getAccountIssuerInformation(ID as string);

        let tomlInformation = "";

        if (horizonInfo.home_domain != undefined) {
          tomlInformation = await getDomainInformation(horizonInfo.home_domain);
        }

        const splittedInformation = tomlInformation.split("\n");
        let document = false;
        const documentInfo: DocumentInfo = {};

        for (const i in splittedInformation) {
          if (splittedInformation[i] == "[DOCUMENTATION]") {
            document = true;
            continue;
          }

          if (!document) {
            continue;
          }

          if (splittedInformation[i] == "" && document) {
            document = false;
            continue;
          }

          const _pattern = splittedInformation[i].split("=");
          documentInfo[_pattern[0].trim()] = _pattern[1]
            .replace(/"/g, "")
            .trim();
        }
        setInformation({
          home_domain: horizonInfo.home_domain,
          created_at: horizonInfo.last_modified_time,
          thresholds: horizonInfo.thresholds,
          flags: horizonInfo.flags,
          signers: horizonInfo.signers,
          entries: horizonInfo.data_attr,
          balances: horizonInfo.balances,
          meta_data: documentInfo,
          issuers: accountIssuer.records,
          tomlInfo: tomlInformation,
        });
      }
    };
    handler();
  }, [ID]);

  useEffect(() => {
    if (information.tomlInfo) {
      const accountsMatch = information.tomlInfo.match(
        /ACCOUNTS\s*=\s*\[([\s\S]*?)\]/
      );

      if (accountsMatch && accountsMatch[1]) {
        const newAccounts = accountsMatch[1]
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => line.replace(/^"|"$|,$/g, ""));

        const cleanedAccounts = newAccounts.map((account) =>
          account.replace(/"/g, "")
        );

        const foundAccount = cleanedAccounts.some(
          (accountId) => accountId === ID
        );

        setIsVisibleHomeDomainInfo(foundAccount);
      } else {
        setIsVisibleHomeDomainInfo(false);
      }
    } else {
      setIsVisibleHomeDomainInfo(false);
    }
  }, [information.tomlInfo, ID]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getAllTransactions(net);
        setTransactionsFromFirebase(transactions);

        // Временный массив с типом 'DecodedTransaction[]'
        const decodedList: DecodedTransactions = [];

        transactions.forEach(({ xdr }, index) => {
          try {
            const transaction = TransactionBuilder.fromXDR(xdr, network) as Transaction;

            if (transaction.source === ID) {
              decodedList.push({ index, transaction });
            }
          } catch (error) {
            console.error("Ошибка при декодировании транзакции:", error);
          }
        });

        // Обновляем состояние, проверяем длину списка
        setDecodedTransactions(decodedList.length > 0 ? decodedList : null);
      } catch (error) {
        console.error("Ошибка при получении транзакций:", error);
      }
    };

    if (net && ID) {
      fetchTransactions();
    }
  }, [net, ID]);

  useEffect(() => {
    if (decodedTransactions && secondInformation?.sequence) {
      const stales: ISeqNumIsStale[] = decodedTransactions.map((item, index) => {
        if (item?.transaction?.sequence && secondInformation?.sequence) {
          const isStale = isSequenceNumberOutdated(
            BigInt(secondInformation.sequence),
            BigInt(item.transaction.sequence)
          );
          return { index, isStale: !isStale };
        }
        return { index, isStale: false };
      });

      setSeqNumsIsStales(stales);
    }
  }, [decodedTransactions, secondInformation]);

  return (
    <MainLayout>
      <div className="container">
        <div className="account-view">
          {isLoading ? (
            "Loading..."
          ) : exists ? (
            <>
              <h2 className="word-break relative condensed">
                <span className="dimmed">
                  {information.signers?.length === 1 ? (
                    <span>Personal</span>
                  ) : (
                    <span>Corporate</span>
                  )}{" "}
                  Account&nbsp;&nbsp;&nbsp;
                </span>
                <span className="account-address plain">
                  <span className="account-key">{ID}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="account-key"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <a
                      href={`https://stellar.expert/explorer/${net}/account/${ID}`}
                      title="View on Stellar.Expert"
                      target="_blank"
                    >
                      <i className="fa-solid fa-up-right-from-square"></i>
                    </a>
                  </span>
                </span>
              </h2>

              <div className="row space">
                <div className="column column-50">
                  <div className="segment blank">
                    <h3>Summary</h3>
                    <hr className="flare"></hr>
                    <dl>
                      {information?.home_domain !== undefined &&
                      isVisibleHomeDomainInfo &&
                      information.home_domain &&
                      !ignoredHomeDomains.includes(information.home_domain) ? (
                        <>
                          <dt>Home domain:</dt>
                          <dd>
                            <a
                              href={`${
                                information?.home_domain === undefined
                                  ? "#"
                                  : information?.home_domain
                              }`}
                              rel="noreferrer noopener"
                              target="_blank"
                            >
                              {information?.home_domain === undefined
                                ? "none"
                                : information?.home_domain}
                            </a>
                            <i className="trigger icon info-tooltip small icon-help">
                              <div
                                className="tooltip-wrapper"
                                style={{
                                  maxWidth: "20em",
                                  left: "-193px",
                                  top: "-142px",
                                }}
                              >
                                <div className="tooltip top">
                                  <div className="tooltip-content">
                                    A domain name that can optionally be added
                                    to the account. Clients can look up a
                                    stellar.toml from this domain. The
                                    federation procol can use the home domain to
                                    look up more details about a transaction’s
                                    memo or address details about an account.
                                    <a
                                      href="https://developers.stellar.org/docs/learn/glossary#home-domain"
                                      className="info-tooltip-link"
                                      target="_blank"
                                    >
                                      Read more…
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </i>
                          </dd>
                        </>
                      ) : null}
                      <dt>Account lock status:</dt>
                      <dd>
                        unlocked
                        <i className="trigger icon info-tooltip small icon-help">
                          <div
                            className="tooltip-wrapper"
                            style={{
                              maxWidth: "20em",
                              left: "-193px",
                              top: "-105px",
                            }}
                          >
                            <div className="tooltip top">
                              <div className="tooltip-content">
                                The account is unlocked, all operations are
                                permitted, including payments, trades, settings
                                changes, and assets issuing.
                                <a
                                  href="https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds"
                                  className="info-tooltip-link"
                                  target="_blank"
                                >
                                  Read more…
                                </a>
                              </div>
                            </div>
                          </div>
                        </i>
                      </dd>
                      <dt>Operation thresholds:</dt>
                      <dd>
                        <span title="Low threshold">
                          {information?.thresholds?.low_threshold}
                        </span>{" "}
                        /
                        <span title="Medium threshold">
                          {" "}
                          {information?.thresholds?.med_threshold}
                        </span>{" "}
                        /
                        <span title="High threshold">
                          {" "}
                          {information?.thresholds?.high_threshold}
                        </span>
                        <i className="trigger icon info-tooltip small icon-help">
                          <div
                            className="tooltip-wrapper"
                            style={{
                              maxWidth: "20em",
                              left: "-193px",
                              top: "-86px",
                            }}
                          >
                            <div className="tooltip top">
                              <div className="tooltip-content">
                                This field specifies thresholds for low-,
                                medium-, and high-access level operations.
                                <a
                                  href="https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig#thresholds"
                                  className="info-tooltip-link"
                                  target="_blank"
                                >
                                  Read more…
                                </a>
                              </div>
                            </div>
                          </div>
                        </i>
                      </dd>
                      <dt>Asset authorization flags:</dt>
                      <dd>
                        {information?.flags?.auth_required == true
                          ? "required, "
                          : ""}
                        {information?.flags?.auth_revocable == true
                          ? "revocable, "
                          : ""}
                        {information?.flags?.auth_clawback_enabled == true
                          ? "clawback_enabled, "
                          : ""}
                        {information?.flags?.auth_immutable == true
                          ? "immutable, "
                          : ""}
                        {information?.flags?.auth_required == false &&
                        information?.flags?.auth_revocable == false &&
                        information?.flags?.auth_clawback_enabled == false &&
                        information?.flags?.auth_immutable == false
                          ? "none"
                          : ""}

                        <i className="trigger icon info-tooltip small icon-help">
                          <div
                            className="tooltip-wrapper"
                            style={{
                              maxWidth: "20em",
                              left: "-193px",
                              top: "-256px",
                            }}
                          >
                            <div className="tooltip top">
                              <div className="tooltip-content">
                                <ul>
                                  <li>
                                    <code>AUTH_REQUIRED</code> Requires the
                                    issuing account to give other accounts
                                    permission before they can hold the issuing
                                    account’s credit.
                                  </li>
                                  <li>
                                    <code>AUTH_REVOCABLE</code> Allows the
                                    issuing account to revoke its credit held by
                                    other accounts.
                                  </li>
                                  <li>
                                    <code>AUTH_CLAWBACK_ENABLED</code> Allows
                                    the issuing account to clawback tokens
                                    without the account consent in case of
                                    service terms violation.
                                  </li>
                                  <li>
                                    <code>AUTH_IMMUTABLE</code> If set then none
                                    of the authorization flags can be set and
                                    the account can never be deleted.
                                  </li>
                                </ul>
                                <a
                                  href="https://developers.stellar.org/docs/learn/glossary#flags"
                                  className="info-tooltip-link"
                                  target="_blank"
                                >
                                  Read more…
                                </a>
                              </div>
                            </div>
                          </div>
                        </i>
                      </dd>
                    </dl>

                    {information?.issuers?.length &&
                    information?.issuers?.length > 0 ? (
                      <div className="account-issued-assets">
                        <h4
                          style={{
                            marginBottom: "0px",
                          }}
                        >
                          Issued Assets
                          <i className="trigger icon info-tooltip small icon-help">
                            <div
                              className="tooltip-wrapper"
                              style={{
                                maxWidth: "20em",
                                left: "-193px",
                                top: "-86px",
                              }}
                            >
                              <div className="tooltip top">
                                <div className="tooltip-content">
                                  An account can issue custom Stellar assets.
                                  Any asset on the network can be traded and
                                  exchanged with any other.
                                  <a
                                    href="https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets"
                                    className="info-tooltip-link"
                                    target="_blank"
                                  >
                                    Read more…
                                  </a>
                                </div>
                              </div>
                            </div>
                          </i>
                        </h4>
                        <div className="text-small">
                          <ul>
                            {Array.isArray(information?.issuers) &&
                              (information?.issuers as Issuer[]).map(
                                (issuer: Issuer, key: number) => {
                                  return (
                                    <li key={key}>
                                      <a
                                        aria-label={issuer.paging_token}
                                        className="asset-link"
                                        href={`https://stellar.expert/explorer/${net}/asset/${issuer.asset_code}-${issuer.asset_issuer}`}
                                        target="_blank"
                                      >
                                        {issuer?.asset_code}
                                      </a>
                                      &nbsp;
                                    </li>
                                  );
                                }
                              )}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    <h4 style={{ marginBottom: "0px" }}>
                      Signers
                      <i className="trigger icon info-tooltip small icon-help">
                        <div
                          className="tooltip-wrapper"
                          style={{
                            maxWidth: "20em",
                            left: "0px",
                            top: "0px",
                          }}
                        >
                          <div className="tooltip top">
                            <div className="tooltip-content">
                              Used for multi-sig. This field lists other public
                              keys and their weights, which can be used to
                              authorize transactions for this account.
                              <a
                                href="https://developers.stellar.org/docs/learn/encyclopedia/security/signatures-multisig"
                                className="info-tooltip-link"
                                target="_blank"
                              >
                                Read more…
                              </a>
                            </div>
                          </div>
                        </div>
                      </i>
                    </h4>
                    <ul className="text-small condensed">
                      {information?.signers?.map(
                        (item: Signer, index: number) => {
                          return (
                            <li key={index}>
                              <Link
                                href={`/public/account?id=${item.key}`}
                                legacyBehavior
                              >
                                <a
                                  title={item.key}
                                  aria-label={item.key}
                                  className="account-address word-break"
                                >
                                  <span>{collapseAccount(item.key)} </span>
                                </a>
                              </Link>
                              (w:
                              <b>{item.weight}</b>)
                            </li>
                          );
                        }
                      )}
                    </ul>
                    {information?.entries &&
                    Object.keys(information?.entries).length ? (
                      <>
                        <h4
                          style={{
                            marginBottom: "0px",
                          }}
                        >
                          Data Entries
                          <i className="trigger icon info-tooltip small icon-help">
                            <div
                              className="tooltip-wrapper"
                              style={{
                                maxWidth: "20em",
                                left: "0px",
                                top: "0px",
                              }}
                            >
                              <div className="tooltip top">
                                <div className="tooltip-content">
                                  Data entries are key value pairs attached to
                                  an account. They allow account controllers to
                                  attach arbitrary data to their account.
                                  <a
                                    href="https://www.stellar.org/developers/guides/concepts/ledger.html#data-entry"
                                    className="info-tooltip-link"
                                    target="_blank"
                                  >
                                    Read more…
                                  </a>
                                </div>
                              </div>
                            </div>
                          </i>
                        </h4>
                        <ul className="text-small condensed">
                          {information?.entries &&
                            Object.keys(information?.entries).map(
                              (entry: string, key: number) => {
                                const { processedKey, processedValue } =
                                  processKeys(
                                    entry,
                                    information.entries[entry]
                                  );
                                return (
                                  <li className="word-break" key={key}>
                                    {processedKey}: {processedValue}
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </>
                    ) : (
                      <></>
                    )}
                    {isVisibleBuildTx && (
                      <Link
                        href={`/${net}/build-transaction?sourceAccount=${ID}`}
                      >
                        Build transaction
                      </Link>
                    )}
                  </div>
                </div>
                <div className="column column-50">
                  <div className="segment blank">
                    <h3>
                      Balances
                      <i className="trigger icon info-tooltip small icon-help">
                        <div
                          className="tooltip-wrapper"
                          style={{
                            maxWidth: "20em",
                            left: "0px",
                            top: "0px",
                          }}
                        >
                          <div className="tooltip top">
                            <div className="tooltip-content">
                              The number of lumens and other assets held by the
                              account.
                              <a
                                href="https://developers.stellar.org/docs/learn/glossary#balance"
                                className="info-tooltip-link"
                                target="_blank"
                              >
                                Read more…
                              </a>
                            </div>
                          </div>
                        </div>
                      </i>
                    </h3>
                    <hr className="flare"></hr>
                    <div>
                      <div className="asset-list-view">
                        <table
                          className="table exportable space"
                          style={{ width: "100%" }}
                        >
                          <tbody>
                            {information.balances &&
                              information.balances.map(
                                (item: Balance, index: number) => {
                                  const totalInfo = item.balance.split(".");
                                  const number = totalInfo[0];
                                  const decimal =
                                    Number(totalInfo[1]) === 0
                                      ? ""
                                      : "." + totalInfo[1];
                                  if (item.asset_type === "native") {
                                    return (
                                      <BalanceItem
                                        key={index}
                                        number={number}
                                        decimal={decimal}
                                        item={item}
                                      />
                                    );
                                  }
                                }
                              )}
                            {information.balances &&
                              information.balances.map(
                                (item: Balance, index: number) => {
                                  const totalInfo = item.balance.split(".");
                                  const number = totalInfo[0];
                                  const decimal =
                                    Number(totalInfo[1]) === 0
                                      ? ""
                                      : "." + totalInfo[1];
                                  if (item.asset_code) {
                                    return (
                                      <BalanceItem
                                        key={index}
                                        number={number}
                                        decimal={decimal}
                                        item={item}
                                      />
                                    );
                                  }
                                }
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {information?.meta_data &&
                information?.meta_data["ORG_NAME"] !== undefined &&
                ignoredHomeDomains &&
                information?.home_domain &&
                !ignoredHomeDomains.includes(information.home_domain) &&
                isVisibleHomeDomainInfo && (
                  <div className="toml-props">
                    <div className="tabs space inline-right">
                      <div className="tabs-header">
                        <div>
                          <a
                            href="#"
                            className={`tabs-item condensed ${
                              tabIndex === 1 ? "selected" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setTabIndex(1);
                            }}
                          >
                            <span className="tabs-item-text">Organization</span>
                          </a>
                          <a
                            href="#"
                            className={`tabs-item condensed ${
                              tabIndex === 2 ? "selected" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              setTabIndex(2);
                            }}
                          >
                            <span className="tabs-item-text">TOML code</span>
                          </a>
                        </div>
                      </div>
                      <hr className="flare"></hr>
                      <div className="tabs-body">
                        {tabIndex == 1 ? (
                          <div className="segment blank">
                            {information?.meta_data &&
                            information.meta_data?.["ORG_NAME"] == undefined ? (
                              <div
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                }}
                              >
                                Empty Data
                              </div>
                            ) : (
                              <dl className="micro-space">
                                <dt>Org name:</dt>
                                <dd>
                                  <span
                                    className="block-select"
                                    tabIndex={-1}
                                    style={{
                                      whiteSpace: "normal",
                                      overflow: "visible",
                                      display: "inline",
                                    }}
                                  >
                                    {information?.meta_data &&
                                      information?.meta_data["ORG_NAME"]}
                                  </span>
                                </dd>
                                <dt>Org url:</dt>
                                <dd>
                                  <a
                                    href={
                                      information?.meta_data &&
                                      information?.meta_data["ORG_URL"]
                                    }
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    {information?.meta_data &&
                                      information?.meta_data["ORG_URL"]}
                                  </a>
                                </dd>
                                <dt>Org logo:</dt>
                                <dd>
                                  <a
                                    href={
                                      information?.meta_data &&
                                      information?.meta_data["ORG_LOGO"]
                                    }
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    {information?.meta_data &&
                                      information?.meta_data["ORG_LOGO"]}
                                  </a>
                                </dd>
                                <dt>Org description:</dt>
                                <dd>
                                  <span
                                    className="block-select"
                                    tabIndex={-1}
                                    style={{
                                      whiteSpace: "normal",
                                      overflow: "visible",
                                      display: "inline",
                                    }}
                                  >
                                    {information?.meta_data &&
                                      information?.meta_data["ORG_DESCRIPTION"]}
                                  </span>
                                </dd>
                                {information.meta_data[
                                  "ORG_PHYSICAL_ADDRESS"
                                ] !== undefined && (
                                  <>
                                    <dt>Org physical address:</dt>
                                    <dd>
                                      <span
                                        className="block-select"
                                        tabIndex={-1}
                                        style={{
                                          whiteSpace: "normal",
                                          overflow: "visible",
                                          display: "inline",
                                        }}
                                      >
                                        {information.meta_data &&
                                          information?.meta_data[
                                            "ORG_PHYSICAL_ADDRESS"
                                          ]}
                                      </span>
                                    </dd>
                                  </>
                                )}
                                {information.meta_data["ORG_OFFICIAL_EMAIL"] !==
                                  undefined && (
                                  <>
                                    <dt>Org official email:</dt>
                                    <dd>
                                      <a
                                        href={`mailto:${
                                          information?.meta_data &&
                                          information?.meta_data[
                                            "ORG_OFFICIAL_EMAIL"
                                          ]
                                        }`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                      >
                                        {information?.meta_data &&
                                          information?.meta_data[
                                            "ORG_OFFICIAL_EMAIL"
                                          ]}
                                      </a>
                                    </dd>
                                  </>
                                )}
                              </dl>
                            )}
                          </div>
                        ) : (
                          <div>
                            <pre
                              className="hljs"
                              style={{
                                maxHeight: "80vh",
                              }}
                            >
                              {information?.tomlInfo == "" ? (
                                <div
                                  style={{
                                    width: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  Empty Data
                                </div>
                              ) : (
                                information?.tomlInfo
                                  ?.split("\n")
                                  ?.map((toml: string, keyinfo: number) => {
                                    if (toml == null || toml.startsWith("#")) {
                                      return;
                                    }
                                    if (toml.indexOf("=") > 0) {
                                      const patterns = toml.split("=");
                                      const key_pattern = patterns[0];
                                      const value_pattern = patterns[1];
                                      return (
                                        <React.Fragment key={keyinfo}>
                                          <span className="hljs-attr">
                                            {key_pattern}
                                          </span>{" "}
                                          ={" "}
                                          <span className="hljs-string">
                                            {value_pattern}
                                          </span>
                                          <br />
                                        </React.Fragment>
                                      );
                                    } else {
                                      if (toml.startsWith("["))
                                        return (
                                          <React.Fragment key={keyinfo}>
                                            <span className="hljs-section">
                                              {toml}
                                            </span>
                                            <br />
                                          </React.Fragment>
                                        );
                                      else {
                                        return (
                                          <React.Fragment key={keyinfo}>
                                            <span className="hljs-string">
                                              {toml}
                                            </span>
                                            <br />
                                          </React.Fragment>
                                        );
                                      }
                                    }
                                  })
                              )}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              <ShowTransactions
                ID={ID}
                decodedTransactions={decodedTransactions}
                setDecodedTransactions={setDecodedTransactions}
                seqNumsIsStales={seqNumsIsStales}
                transactionsFromFirebase={transactionsFromFirebase}
                setTransactionsFromFirebase={setTransactionsFromFirebase}
              />
            </>
          ) : (
            <div className="container">
              <div
                className={`search ${
                  exists === false ? "error" : ""
                } container narrow`}
                style={{ padding: "20px" }}
              >
                <h2 className="text-overflow">Search results for {ID}</h2>
                {exists ? (
                  <p>
                    Account {ID} exists on {net}!
                  </p>
                ) : (
                  <span>{errorvalid}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountInfo;
