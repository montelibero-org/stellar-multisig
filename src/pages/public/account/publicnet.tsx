"use client";

import { MainLayout } from "@/widgets";
import Image from "next/image";
import {
  getAccountIssuerInformation,
  getDomainInformation,
  getMainInformation,
} from "@/features/hooks";
import StellarSdk from "stellar-sdk";
import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import "./public.css";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { Balance, Information, Signer } from "@/shared/types";
import { DocumentInfo, Issuer } from "@/shared/types";
import { processKeys } from "@/shared/lib";
import BalanceItem from "@/pages/public/account/(BalanceItem)";
import ignoredHomeDomains from "@/shared/configs/ignored-home-domains.json";

interface Props {
  id: string;
}

export const collapseAccount = (accountId: string) => {
  if (accountId == "" || accountId == null || accountId == undefined) {
    return <br />;
  }
  const first4Str = accountId.substring(0, 4);
  const last4Str = accountId.substr(-4);
  return first4Str + "..." + last4Str;
};

const PublicNet: FC<Props> = ({ id }) => {
  const account: string = id;
  const { net }: { net: string } = useStore(
    useShallow((state) => ({ net: state.net }))
  );
  const [information, setInformation] = useState<Information>(
    {} as Information
  );
  const [exists, setExists] = useState<boolean>(true);
  const [tabIndex, setTabIndex] = useState<number>(1);
  const [errorvalid, setErrorvalid] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisibleHomeDomainInfo, setIsVisibleHomeDomainInfo] =
    useState<boolean>(true);

  useEffect(() => {
    const checkAccount = async () => {
      const serverUrl =
        net === "testnet"
          ? "https://horizon-testnet.stellar.org"
          : "https://horizon.stellar.org";
      const server = new StellarSdk.Server(serverUrl);

      try {
        await server.loadAccount(account);
        setExists(true);
        // Navigate to the account page if the account exists
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

    if (StellarSdk.StrKey.isValidEd25519PublicKey(account)) {
      checkAccount();
    } else {
      setTimeout(() => {
        setExists(false);
      }, 2000);
      setErrorvalid(
        `"Cannot read properties of null (reading 'invalidAsset')" at ${account}`
      );
    }
  }, [net, account]);

  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      if (account != "") {
        const horizonInfo = await getMainInformation(account as string);
        const accountIssuer = await getAccountIssuerInformation(
          account as string
        );

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
      setLoading(false);
    };
    handler();
  }, [account]);

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
          (accountId) => accountId === id
        );

        setIsVisibleHomeDomainInfo(foundAccount);
      } else {
        setIsVisibleHomeDomainInfo(false);
      }
    } else {
      setIsVisibleHomeDomainInfo(false);
    }
  }, [information.tomlInfo, id]);

  return (
    <MainLayout>
      <div className="container">
        <div className="account-view">
          {loading ? (
            "Loading..."
          ) : exists ? (
            <>
              <h2 className="word-break relative condensed">
                <span className="dimmed">Account&nbsp;&nbsp;&nbsp;</span>
                <span className="account-address plain">
                  <span className="account-key">{account}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="account-key"
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <a
                      href={`https://stellar.expert/explorer/${net}/account/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on Stellar.Expert"
                    >
                      <Image
                        src="../stellar-expert-logo.png"
                        alt="Stellar Expert Logo"
                        className="dark:invert"
                        width={30}
                        style={{
                          display: "inline-block",
                        }}
                        height={30}
                        priority
                      />
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
                          Assets Issued by this Account
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
                            {information?.issuers?.map(
                              (issuer: Issuer, key: number) => {
                                return (
                                  <li key={key}>
                                    <Link href="#" legacyBehavior>
                                      <a
                                        aria-label={issuer.paging_token}
                                        className="asset-link"
                                      >
                                        {issuer?.asset_code}
                                      </a>
                                    </Link>
                                    &nbsp;
                                    <span className="">
                                      ({issuer.accounts.authorized} trustlines)
                                    </span>
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
                      Account Signers
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
                  </div>
                </div>
                <div className="column column-50">
                  <div className="segment blank">
                    <h3>
                      Account Balances
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
                            {information?.balances
                              ?.filter((item: Balance) => !item?.asset_code)
                              .map((item: Balance, index: number) => {
                                const totalInfo = item.balance.split(".");
                                const number = totalInfo[0];
                                const decimal =
                                  Number(totalInfo[1]) === 0
                                    ? ""
                                    : "." + totalInfo[1];

                                return (
                                  <BalanceItem
                                    key={index}
                                    number={number}
                                    decimal={decimal}
                                    item={item}
                                  />
                                );
                              })}
                            {information?.balances
                              ?.filter((item: Balance) => item?.asset_code)
                              .map((item: Balance, index: number) => {
                                const totalInfo = item.balance.split(".");
                                const number = totalInfo[0];
                                const decimal =
                                  Number(totalInfo[1]) === 0
                                    ? ""
                                    : "." + totalInfo[1];

                                return (
                                  <BalanceItem
                                    key={index}
                                    number={number}
                                    decimal={decimal}
                                    item={item}
                                  />
                                );
                              })}
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
              isVisibleHomeDomainInfo ? (
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
                              style={{ fontSize: "13px", textAlign: "center" }}
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
                              {information.meta_data["ORG_PHYSICAL_ADDRESS"] !==
                                undefined && (
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
              ) : null}
            </>
          ) : (
            <div className="cotainer">
              <div
                className={`search ${
                  exists === false ? "error" : ""
                } container narrow`}
                style={{ padding: "20px" }}
              >
                <h2 className="text-overflow">Search results for {account}</h2>
                {exists ? (
                  <p>
                    Account {account} exists on {net}!
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

export default PublicNet;
