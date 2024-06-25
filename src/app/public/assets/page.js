"use client";

import MainLayout from "@/components/layouts";
import {
    getDirectoryInformation,
    getDomainInformation,
    getMainInformation,
} from "@/hook";
import React, { useEffect, useState } from "react";

const Assets = () => {
    const [filter, setFilter] = useState("");
    const [currenciesArray, setCurrenciesArray] = useState([]);

    useEffect(() => {
        const handler = async () => {
            if (filter == "") return;
            const mainInformation = await getMainInformation(filter);
            const home_domain = mainInformation.home_domain;

            if (!home_domain) return;

            const domainInformation = await getDomainInformation(home_domain);

            const splittedInformation = domainInformation.split("\n");
            let currencies = false;
            let currencyInfo = {};
            let currencyInfoArray = [];

            for (let i in splittedInformation) {
                if (splittedInformation[i] == "[[CURRENCIES]]") {
                    currencies = true;
                    continue;
                }

                if (!currencies) {
                    continue;
                }

                if (splittedInformation[i] == "" && currencies) {
                    currencies = false;
                    currencyInfoArray.push(currencyInfo);
                    currencyInfo = {};
                    continue;
                }

                const _pattern = splittedInformation[i].split("=");
                currencyInfo[_pattern[0].trim()] = _pattern[1]
                    .replace(/"/g, "")
                    .trim();
            }

            setCurrenciesArray(currencyInfoArray);
        };

        handler();
    }, [filter]);

    return (
        <MainLayout>
            <div className="container narrow">
                <h2>Trusted MTL Assets</h2>
                <div
                    className="text-right mobile-left"
                    style={{ marginTop: "-2.2em" }}
                >
                    <a
                        href="#"
                        className="icon icon-github"
                        title="Log in with Github"
                        style={{ fontSize: "1.4em" }}
                    ></a>
                </div>
                <div className="segment blank directory">
                    <p className="dimmed text-small">
                        The list of Trusted MTL Assets.
                    </p>
                    <div className="text-center double-space">
                        <form>
                            <input
                                type="text"
                                className="primary"
                                placeholder="Search accounts by domain, company name, or public key"
                                value={filter}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFilter(e.currentTarget.value);
                                }}
                                style={{ maxWidth: "36em" }}
                            />
                        </form>
                        <div>
                            <div className="dimmed text-small">
                                Filter by tag:
                            </div>
                            <div className="row">
                                <div className="column column-25">
                                    <a className="tag-block" href="#exchange">
                                        #exchange
                                        <span className="description">
                                            Centralized exchange account
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#anchor">
                                        #anchor
                                        <span className="description">
                                            Operational account of an anchor
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#issuer">
                                        #issuer
                                        <span className="description">
                                            Well known asset issuer account
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#wallet">
                                        #wallet
                                        <span className="description">
                                            Shared account that belongs to a
                                            wallet
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#custodian">
                                        #custodian
                                        <span className="description">
                                            Reserved, custodian account, or cold
                                            wallet
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#malicious">
                                        #malicious
                                        <span className="description">
                                            Account involved in
                                            theft/scam/spam/phishing
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#unsafe">
                                        #unsafe
                                        <span className="description">
                                            Obsolete or potentially dangerous
                                            account
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#personal">
                                        #personal
                                        <span className="description">
                                            Personal signing key or account
                                            address
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#sdf">
                                        #sdf
                                        <span className="description">
                                            Account under the custody of SDF
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a
                                        className="tag-block"
                                        href="#memo-required"
                                    >
                                        #memo-required
                                        <span className="description">
                                            Destination requires transaction
                                            memo
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a className="tag-block" href="#airdrop">
                                        #airdrop
                                        <span className="description">
                                            Airdrop distribution account
                                        </span>
                                    </a>
                                </div>
                                <div className="column column-25">
                                    <a
                                        className="tag-block"
                                        href="#obsolete-inflation-pool"
                                    >
                                        #obsolete-inflation-pool
                                        <span className="description">
                                            Inflation pool distribution account
                                            (obsolete)
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ul className="striped space">
                        {currenciesArray?.map((currency, index) => {
                            return (
                                <li
                                    key={index}
                                    style={{
                                        padding: "1em",
                                        lineHeight: "1.6",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div>
                                        <b>
                                            {currency.name}({currency.code})
                                        </b>{" "}
                                        <a
                                            href="https://null"
                                            className="text-small"
                                        ></a>
                                        <a className="inline-tag" href="#">
                                            #{currency.anchor_asset_type}
                                        </a>
                                    </div>
                                    <a
                                        title={currency.issuer}
                                        aria-label={currency.issuer}
                                        className="account-address"
                                        href={`/public/${currency.issuer}`}
                                        style={{ marginRight: "1em" }}
                                    >
                                        <span className="account-key">
                                            {currency.issuer}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="grid-actions text-center space relative">
                        <div className="button-group">
                            <button className="button disabled" disabled="">
                                Prev Page
                            </button>
                            <button className="button disabled" disabled="">
                                Next Page
                            </button>
                        </div>
                    </div>
                    {/* <div className="double-space dimmed">
                        <p>
                            You can request new address listing{" "}
                            <a href="/directory/add">here</a>. The data from{" "}
                            <a
                                href="/openapi.html#tag/Directory-API"
                                target="_blank"
                            >
                                Open Directory API
                            </a>{" "}
                            is publicly available for developers and users, free
                            of charge. Please note: listing in the directory is
                            not an endorsement, the maintainers do not verify
                            legal entities operating the listed accounts.
                        </p>
                    </div> */}
                </div>
            </div>
        </MainLayout>
    );
};

export default Assets;
