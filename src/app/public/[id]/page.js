"use client";

import MainLayout from "@/components/layouts";
import {
    getAccountIssuerInformation,
    getMainInformation,
    getStellarAccount,
    getStellarDomain,
    getStellarValues,
} from "@/hook";
import React, { useEffect, useState } from "react";
import "./public.css";

const PublicNet = () => {
    const [account, setAccount] = useState("");

    const [information, setInformation] = useState({});

    const [tabIndex, setTabIndex] = useState(1);

    const [show, setShow] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const pathname = window.location.pathname;
        const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);

        setAccount(accountId);

        return () => {};
    }, []);

    useEffect(() => {
        const handler = async () => {
            setLoading(true);
            if (account != "") {
                const horizonInfo = await getMainInformation(account);
                const accountIssuer = await getAccountIssuerInformation(
                    account
                );

                const stellarExpertDomain = await getStellarDomain(
                    "public",
                    horizonInfo.home_domain
                );
                setInformation({
                    home_domain: horizonInfo.home_domain,
                    // total_payment: stellarExpertInfo.payments,
                    // total_trades: stellarExpertInfo.trades,
                    created_at: horizonInfo.last_modified_time,
                    // created_by: stellarExpertInfo.creator,
                    // activity: stellarExpertInfo.activity,
                    thresholds: horizonInfo.thresholds,
                    flags: horizonInfo.flags,
                    signers: horizonInfo.signers,
                    entries: horizonInfo.data_attr,
                    // trustlines: stellarExpertValue.trustlines,
                    // total: stellarExpertValue.total,
                    balances: horizonInfo.balances,
                    meta_data: stellarExpertDomain.meta,
                    issuers: accountIssuer.records,
                });
            }
            setLoading(false);
        };
        handler();
    }, [account]);

    const collapseAccount = (accountId) => {
        if (accountId == "" || accountId == null || accountId == undefined) {
            return;
        }
        const first4Str = accountId.substring(0, 4);
        const last4Str = accountId.substr(-4);
        return first4Str + "..." + last4Str;
    };

    return (
        <MainLayout>
            <div className="container">
                <div className="account-view">
                    {loading ? (
                        "Loading..."
                    ) : (
                        <h2 className="word-break relative condensed">
                            <span className="dimmed">Account&nbsp;&nbsp;</span>
                            <span className="account-address plain">
                                <span className="account-key">{account}</span>
                            </span>
                            <div className="row space">
                                <div className="column column-50">
                                    <div className="segment blank">
                                        <h3>
                                            Summary
                                            <a
                                                href="#"
                                                className="trigger icon icon-embed"
                                            >
                                                <div
                                                    className="tooltip-wrapper"
                                                    style={{
                                                        maxWidth: "20em",
                                                        left: "-193px",
                                                        top: "-44px",
                                                    }}
                                                >
                                                    <div className="tooltip top">
                                                        <div className="tooltip-content">
                                                            Get embeddable
                                                            widget code for this
                                                            block
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </h3>
                                        <hr className="flare"></hr>
                                        <dl>
                                            <dt>Home domain:</dt>
                                            <dd>
                                                <a
                                                    href={`https://${information?.home_domain}`}
                                                    rel="noreferrer noopener"
                                                    target="_blank"
                                                >
                                                    {information?.home_domain}
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
                                                                A domain name
                                                                that can
                                                                optionally be
                                                                added to the
                                                                account. Clients
                                                                can look up a
                                                                stellar.toml
                                                                from this
                                                                domain. The
                                                                federation
                                                                procol can use
                                                                the home domain
                                                                to look up more
                                                                details about a
                                                                transaction’s
                                                                memo or address
                                                                details about an
                                                                account.
                                                                <a
                                                                    href="#"
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
                                            {/* <dt>Total payments:</dt>
                                            <dd>
                                                {information?.total_payment}
                                                <i className="trigger icon info-tooltip small icon-help">
                                                    <div
                                                        className="tooltip-wrapper"
                                                        style={{
                                                            maxwidth: "20em",
                                                            left: "-193px",
                                                            top: "-44px",
                                                        }}
                                                    >
                                                        <div className="tooltip top">
                                                            <div className="tooltip-content">
                                                                Overall number
                                                                of payments.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
                                            {/* <dt>Total trades:</dt>
                                            <dd>
                                                {information?.total_trades}
                                                <i className="trigger icon info-tooltip small icon-help">
                                                    <div
                                                        className="tooltip-wrapper"
                                                        style={{
                                                            maxWidth: "20em",
                                                            left: "-193px",
                                                            top: "-44px",
                                                        }}
                                                    >
                                                        <div className="tooltip top">
                                                            <div className="tooltip-content">
                                                                Overall number
                                                                of trades.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
                                            {/* <dt>Created:</dt>
                                            <dd>
                                                <span
                                                    className=""
                                                    tabIndex="-1"
                                                    title="Sep 26 2023 04:22:56 GMT+0900"
                                                >
                                                    {information?.created_at}
                                                </span>
                                                <i className="trigger icon info-tooltip small icon-help">
                                                    <div
                                                        className="tooltip-wrapper"
                                                        style={{
                                                            maxWidth: "20em",
                                                            left: "-193px",
                                                            top: "-44px",
                                                        }}
                                                    >
                                                        <div className="tooltip top">
                                                            <div className="tooltip-content">
                                                                Account creation
                                                                timestamp.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
                                            {/* <dt>Created by:</dt>
                                            <dd>
                                                <a
                                                    title={
                                                        information?.created_by
                                                    }
                                                    aria-label={
                                                        information?.created_by
                                                    }
                                                    className="account-address"
                                                    href={`/public/${information?.created_by}`}
                                                >
                                                    <span className="">
                                                        {collapseAccount(
                                                            information?.created_by
                                                        )}
                                                    </span>
                                                </a>
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
                                                                The account that
                                                                was used to
                                                                create and
                                                                provide initial
                                                                funding for this
                                                                account.
                                                                <a
                                                                    href="https://www.stellar.org/developers/guides/concepts/list-of-operations.html#create-account"
                                                                    className="info-tooltip-link"
                                                                    target="_blank"
                                                                >
                                                                    Read more…
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
                                            {/* <dt>Last year activity:</dt>
                                            <dd>
                                                {information?.activity?.yearly}
                                                <i className="trigger icon info-tooltip small icon-help">
                                                    <div
                                                        className="tooltip-wrapper"
                                                        style={{
                                                            maxWidth: "20em",
                                                            left: "-193px",
                                                            top: "-82px",
                                                        }}
                                                    >
                                                        <div className="tooltip top">
                                                            <div className="tooltip-content">
                                                                Activity index
                                                                is based on the
                                                                total number of
                                                                payments and
                                                                trades made by
                                                                the account
                                                                during a certain
                                                                period of time
                                                                (last month or
                                                                last year).
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
                                            {/* <dt>Last month activity:</dt>
                                            <dd>
                                                {information?.activity?.monthly}
                                                <i className="trigger icon info-tooltip small icon-help">
                                                    <div
                                                        className="tooltip-wrapper"
                                                        style={{
                                                            maxWidth: "20em",
                                                            left: "-193px",
                                                            top: "-82px",
                                                        }}
                                                    >
                                                        <div className="tooltip top">
                                                            <div className="tooltip-content">
                                                                Activity index
                                                                is based on the
                                                                total number of
                                                                payments and
                                                                trades made by
                                                                the account
                                                                during a certain
                                                                period of time
                                                                (last month or
                                                                last year).
                                                            </div>
                                                        </div>
                                                    </div>
                                                </i>
                                            </dd> */}
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
                                                                The account is
                                                                unlocked, all
                                                                operations are
                                                                permitted,
                                                                including
                                                                payments,
                                                                trades, settings
                                                                changes, and
                                                                assets issuing.
                                                                <a
                                                                    href="https://www.stellar.org/developers/guides/concepts/operations.html#thresholds"
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
                                                    {
                                                        information?.thresholds
                                                            ?.low_threshold
                                                    }
                                                </span>{" "}
                                                /
                                                <span title="Medium threshold">
                                                    {" "}
                                                    {
                                                        information?.thresholds
                                                            ?.med_threshold
                                                    }
                                                </span>{" "}
                                                /
                                                <span title="High threshold">
                                                    {" "}
                                                    {
                                                        information?.thresholds
                                                            ?.high_threshold
                                                    }
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
                                                                This field
                                                                specifies
                                                                thresholds for
                                                                low-, medium-,
                                                                and high-access
                                                                level
                                                                operations.
                                                                <a
                                                                    href="#"
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
                                                {information?.flags
                                                    ?.auth_required == true
                                                    ? "required, "
                                                    : ""}
                                                {information?.flags
                                                    ?.auth_revocable == true
                                                    ? "revocable, "
                                                    : ""}
                                                {information?.flags
                                                    ?.auth_clawback_enabled ==
                                                true
                                                    ? "clawback_enabled, "
                                                    : ""}
                                                {information?.flags
                                                    ?.auth_immutable == true
                                                    ? "immutable, "
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
                                                                        <code>
                                                                            AUTH_REQUIRED
                                                                        </code>{" "}
                                                                        Requires
                                                                        the
                                                                        issuing
                                                                        account
                                                                        to give
                                                                        other
                                                                        accounts
                                                                        permission
                                                                        before
                                                                        they can
                                                                        hold the
                                                                        issuing
                                                                        account’s
                                                                        credit.
                                                                    </li>
                                                                    <li>
                                                                        <code>
                                                                            AUTH_REVOCABLE
                                                                        </code>{" "}
                                                                        Allows
                                                                        the
                                                                        issuing
                                                                        account
                                                                        to
                                                                        revoke
                                                                        its
                                                                        credit
                                                                        held by
                                                                        other
                                                                        accounts.
                                                                    </li>
                                                                    <li>
                                                                        <code>
                                                                            AUTH_CLAWBACK_ENABLED
                                                                        </code>{" "}
                                                                        Allows
                                                                        the
                                                                        issuing
                                                                        account
                                                                        to
                                                                        clawback
                                                                        tokens
                                                                        without
                                                                        the
                                                                        account
                                                                        consent
                                                                        in case
                                                                        of
                                                                        service
                                                                        terms
                                                                        violation.
                                                                    </li>
                                                                    <li>
                                                                        <code>
                                                                            AUTH_IMMUTABLE
                                                                        </code>{" "}
                                                                        If set
                                                                        then
                                                                        none of
                                                                        the
                                                                        authorization
                                                                        flags
                                                                        can be
                                                                        set and
                                                                        the
                                                                        account
                                                                        can
                                                                        never be
                                                                        deleted.
                                                                    </li>
                                                                </ul>
                                                                <a
                                                                    href="https://www.stellar.org/developers/guides/concepts/accounts.html#flags"
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
                                        <div className="account-issued-assets">
                                            <h4 style={{ marginBottom: "0px" }}>
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
                                                                An account can
                                                                issue custom
                                                                Stellar assets.
                                                                Any asset on the
                                                                network can be
                                                                traded and
                                                                exchanged with
                                                                any other.
                                                                <a
                                                                    href="#"
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
                                                        (issuer, key) => {
                                                            if (
                                                                issuer.amount ==
                                                                0
                                                            )
                                                                return;
                                                            return (
                                                                <li key={key}>
                                                                    <a
                                                                        aria-label={
                                                                            issuer.paging_token
                                                                        }
                                                                        className="asset-link"
                                                                        href="#"
                                                                    >
                                                                        <span
                                                                            className="asset-icon"
                                                                            style={{
                                                                                backgroundImage:
                                                                                    'url("https://ipfs.io/ipfs/bafkreidkhoqgjf42z3jxjd7wqgxy47vulncpnr5wdlib5pbb3inklcipzy")',
                                                                            }}
                                                                        ></span>
                                                                        {
                                                                            issuer.asset_code
                                                                        }
                                                                    </a>
                                                                    &nbsp;
                                                                    <span className="">
                                                                        (
                                                                        {
                                                                            issuer
                                                                                .accounts
                                                                                .authorized
                                                                        }{" "}
                                                                        trustlines)
                                                                    </span>
                                                                </li>
                                                            );
                                                        }
                                                    )}
                                                </ul>
                                                <a
                                                    href="#"
                                                    className=""
                                                    onClick={() => {
                                                        setShow(!show);
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            borderBottom:
                                                                "1px dotted",
                                                        }}
                                                    >
                                                        Hide assets with zero
                                                        supply
                                                    </span>
                                                    <i className="icon angle double down vtop"></i>
                                                </a>
                                                {show && (
                                                    <ul>
                                                        {information?.issuers?.map(
                                                            (issuer, key) => {
                                                                if (
                                                                    issuer.amount !=
                                                                    0
                                                                )
                                                                    return;
                                                                return (
                                                                    <li
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <a
                                                                            aria-label={
                                                                                issuer.paging_token
                                                                            }
                                                                            className="asset-link"
                                                                            href="#"
                                                                        >
                                                                            <span
                                                                                className="asset-icon"
                                                                                style={{
                                                                                    backgroundImage:
                                                                                        'url("https://ipfs.io/ipfs/bafkreig7wvit3ottowoopyizrvhqx6it6lksx4yqyyevahirli27fb4lb4")',
                                                                                }}
                                                                            ></span>
                                                                            {
                                                                                issuer.asset_code
                                                                            }
                                                                        </a>
                                                                        &nbsp;
                                                                        <span className="">
                                                                            (
                                                                            {
                                                                                issuer
                                                                                    .accounts
                                                                                    .authorized
                                                                            }{" "}
                                                                            trustlines)
                                                                        </span>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                    </ul>
                                                )}
                                                <ul></ul>
                                            </div>
                                        </div>
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
                                                            Used for multi-sig.
                                                            This field lists
                                                            other public keys
                                                            and their weights,
                                                            which can be used to
                                                            authorize
                                                            transactions for
                                                            this account.
                                                            <a
                                                                href="#"
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
                                                (item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <a
                                                                title={item.key}
                                                                aria-label={
                                                                    item.key
                                                                }
                                                                className="account-address word-break"
                                                                href={`/public/${item.key}`}
                                                            >
                                                                <img
                                                                    className="identicon"
                                                                    src='data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 448" fill="hsl(18,58%,52%)"><rect x="128" y="0" width="64" height="64"/><rect x="256" y="0" width="64" height="64"/><rect x="192" y="0" width="64" height="64"/><rect x="192" y="0" width="64" height="64"/><rect x="0" y="64" width="64" height="64"/><rect x="384" y="64" width="64" height="64"/><rect x="64" y="64" width="64" height="64"/><rect x="320" y="64" width="64" height="64"/><rect x="128" y="64" width="64" height="64"/><rect x="256" y="64" width="64" height="64"/><rect x="192" y="64" width="64" height="64"/><rect x="192" y="64" width="64" height="64"/><rect x="128" y="128" width="64" height="64"/><rect x="256" y="128" width="64" height="64"/><rect x="192" y="128" width="64" height="64"/><rect x="192" y="128" width="64" height="64"/><rect x="64" y="192" width="64" height="64"/><rect x="320" y="192" width="64" height="64"/><rect x="128" y="192" width="64" height="64"/><rect x="256" y="192" width="64" height="64"/><rect x="64" y="256" width="64" height="64"/><rect x="320" y="256" width="64" height="64"/><rect x="192" y="320" width="64" height="64"/><rect x="192" y="320" width="64" height="64"/><rect x="0" y="384" width="64" height="64"/><rect x="384" y="384" width="64" height="64"/><rect x="64" y="384" width="64" height="64"/><rect x="320" y="384" width="64" height="64"/><rect x="128" y="384" width="64" height="64"/><rect x="256" y="384" width="64" height="64"/></svg>'
                                                                    width="448"
                                                                    height="448"
                                                                />
                                                                <span className="">
                                                                    {collapseAccount(
                                                                        item.key
                                                                    )}
                                                                </span>
                                                            </a>{" "}
                                                            (w:
                                                            <b>{item.weight}</b>
                                                            )
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                        {/* <h4 style={{ marginBottom: "0px" }}>
                                            Data Entries
                                            <i className="trigger icon info-tooltip small icon-help">
                                                <div
                                                    className="tooltip-wrapper"
                                                    style={{
                                                        maxWidth: `20em`,
                                                        left: "-193px",
                                                        top: "-86px",
                                                    }}
                                                >
                                                    <div className="tooltip top">
                                                        <div className="tooltip-content">
                                                            Data entries are key
                                                            value pairs attached
                                                            to an account. They
                                                            allow account
                                                            controllers to
                                                            attach arbitrary
                                                            data to their
                                                            account.
                                                            <a
                                                                href="#"
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
                                            {information?.entries != null &&
                                                Object.keys(
                                                    information?.entries
                                                ).map((item, key) => {
                                                    return (
                                                        <li key={key}>
                                                            {item +
                                                                ":  " +
                                                                information
                                                                    ?.entries[
                                                                    item
                                                                ]}
                                                        </li>
                                                    );
                                                })}
                                        </ul> */}
                                    </div>
                                </div>
                                <div className="column column-50">
                                    <div className="segment blank">
                                        <h3>
                                            Account Balances
                                            <a
                                                href="#"
                                                className="trigger icon icon-embed"
                                            >
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
                                                            Get embeddable
                                                            widget code for this
                                                            block
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
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
                                                            The number of lumens
                                                            and other assets
                                                            held by the account.
                                                            <a
                                                                href="#"
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
                                        <div className="dimmed text-right mobile-left text-small condensed">
                                            <div
                                                className="desktop-only"
                                                style={{ marginTop: "-2.8em" }}
                                            ></div>
                                            <span className="mobile-only">
                                                Estimated account balances
                                                value:{" "}
                                            </span>
                                            {/* ~ {information?.total / 10000000} */}
                                            <span className="text-tiny">*</span>
                                            <div className="desktop-only space"></div>
                                        </div>
                                        <div className="all-account-balances micro-space text-header">
                                            {information?.balances?.map(
                                                (item, key) => {
                                                    const totalInfo =
                                                        item.balance.split(".");
                                                    const number = totalInfo[0];
                                                    const decimal =
                                                        Number(totalInfo[1]) ==
                                                        0
                                                            ? ""
                                                            : "." +
                                                              totalInfo[1];

                                                    return (
                                                        <a
                                                            href="#"
                                                            key={key}
                                                            className="account-balance"
                                                        >
                                                            <div className="condensed">
                                                                {number}
                                                                <span className="text-small">
                                                                    {decimal}
                                                                </span>
                                                            </div>
                                                            <div className="text-tiny condensed">
                                                                <div>
                                                                    {collapseAccount(
                                                                        item.asset_issuer
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="text-small">
                                                                <span
                                                                    aria-label={
                                                                        item.asset_issuer
                                                                    }
                                                                    className="asset-link"
                                                                >
                                                                    <span className="asset-icon icon icon-stellar"></span>
                                                                    {
                                                                        item.asset_code
                                                                    }
                                                                </span>
                                                            </span>
                                                        </a>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="toml-props">
                                <div className="tabs space inline-right">
                                    <div className="tabs-header">
                                        <div>
                                            <a
                                                href="#"
                                                className="tabs-item condensed selected"
                                                onClick={() => {
                                                    setTabIndex(1);
                                                }}
                                            >
                                                <span className="tabs-item-text">
                                                    Organization
                                                </span>
                                            </a>
                                            <a
                                                href="#"
                                                onClick={() => {
                                                    setTabIndex(2);
                                                }}
                                                className="tabs-item condensed"
                                            >
                                                <span className="tabs-item-text">
                                                    TOML code
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <hr className="flare"></hr>
                                    <div className="tabs-body">
                                        {tabIndex == 1 ? (
                                            <div className="segment blank">
                                                <dl className="micro-space">
                                                    <dt>Org name:</dt>
                                                    <dd>
                                                        <span
                                                            className="block-select"
                                                            tabIndex="-1"
                                                            style={{
                                                                whiteSpace:
                                                                    "normal",
                                                                overflow:
                                                                    "visible",
                                                                display:
                                                                    "inline",
                                                            }}
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ]["ORG_NAME"]}
                                                        </span>
                                                    </dd>
                                                    <dt>Org url:</dt>
                                                    <dd>
                                                        <a
                                                            href={
                                                                information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ]["ORG_URL"]
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer noopener"
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ]["ORG_URL"]}
                                                        </a>
                                                    </dd>
                                                    <dt>Org logo:</dt>
                                                    <dd>
                                                        <a
                                                            href={
                                                                information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ]["ORG_LOGO"]
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer noopener"
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ]["ORG_LOGO"]}
                                                        </a>
                                                    </dd>
                                                    <dt>Org description:</dt>
                                                    <dd>
                                                        <span
                                                            className="block-select"
                                                            tabIndex="-1"
                                                            style={{
                                                                whiteSpace:
                                                                    "normal",
                                                                overflow:
                                                                    "visible",
                                                                display:
                                                                    "inline",
                                                            }}
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ][
                                                                    "ORG_DESCRIPTION"
                                                                ]}
                                                        </span>
                                                    </dd>
                                                    <dt>
                                                        Org physical address:
                                                    </dt>
                                                    <dd>
                                                        <span
                                                            className="block-select"
                                                            tabIndex="-1"
                                                            style={{
                                                                whiteSpace:
                                                                    "normal",
                                                                overflow:
                                                                    "visible",
                                                                display:
                                                                    "inline",
                                                            }}
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ][
                                                                    "ORG_PHYSICAL_ADDRESS"
                                                                ]}
                                                        </span>
                                                    </dd>
                                                    <dt>Org official email:</dt>
                                                    <dd>
                                                        <a
                                                            href={`mailto:${
                                                                information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ][
                                                                    "ORG_OFFICIAL_EMAIL"
                                                                ]
                                                            }`}
                                                            target="_blank"
                                                            rel="noreferrer noopener"
                                                        >
                                                            {information?.meta_data &&
                                                                information
                                                                    ?.meta_data[
                                                                    "DOCUMENTATION"
                                                                ][
                                                                    "ORG_OFFICIAL_EMAIL"
                                                                ]}
                                                        </a>
                                                    </dd>
                                                </dl>
                                            </div>
                                        ) : (
                                            <div>
                                                <pre
                                                    className="hljs"
                                                    style={{
                                                        maxHeight: "80vh",
                                                    }}
                                                >
                                                    <span className="hljs-attr">
                                                        NETWORK_PASSPHRASE
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "NETWORK_PASSPHRASE"
                                                            ]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ACCOUNTS
                                                    </span>{" "}
                                                    =
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "ACCOUNTS"
                                                            ]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-section">
                                                        [DOCUMENTATION]
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_NAME
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ]["ORG_NAME"]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_URL
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ]["ORG_URL"]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_LOGO
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ]["ORG_LOGO"]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_DESCRIPTION
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ][
                                                                "ORG_DESCRIPTION"
                                                            ]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_PHYSICAL_ADDRESS
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ][
                                                                "ORG_PHYSICAL_ADDRESS"
                                                            ]}
                                                        "
                                                    </span>
                                                    <br />
                                                    <span className="hljs-attr">
                                                        ORG_OFFICIAL_EMAIL
                                                    </span>{" "}
                                                    ={" "}
                                                    <span className="hljs-string">
                                                        "
                                                        {information?.meta_data &&
                                                            information
                                                                ?.meta_data[
                                                                "DOCUMENTATION"
                                                            ][
                                                                "ORG_OFFICIAL_EMAIL"
                                                            ]}
                                                        "
                                                    </span>
                                                    <br />
                                                    {information?.meta_data &&
                                                        information?.meta_data[
                                                            "CURRENCIES"
                                                        ]?.map(
                                                            (
                                                                currencies,
                                                                keyinfo
                                                            ) => {
                                                                return (
                                                                    <React.Fragment
                                                                        key={
                                                                            keyinfo
                                                                        }
                                                                    >
                                                                        <span className="hljs-section">
                                                                            [[CURRENCIES]]
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            code
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-string">
                                                                            "
                                                                            {
                                                                                currencies?.code
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            issuer
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-string">
                                                                            "
                                                                            {
                                                                                currencies?.issuer
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            is_asset_anchored
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-literal">
                                                                            "
                                                                            {
                                                                                currencies?.is_asset_anchored
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            desc
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-string">
                                                                            "
                                                                            {
                                                                                currencies?.desc
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            image
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-string">
                                                                            "
                                                                            {
                                                                                currencies?.image
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                        <span className="hljs-attr">
                                                                            display_decimals
                                                                        </span>{" "}
                                                                        ={" "}
                                                                        <span className="hljs-number">
                                                                            "
                                                                            {
                                                                                currencies?.display_decimals
                                                                            }
                                                                            "
                                                                        </span>
                                                                        <br />
                                                                    </React.Fragment>
                                                                );
                                                            }
                                                        )}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </h2>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default PublicNet;
