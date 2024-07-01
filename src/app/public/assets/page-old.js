"use client";

import MainLayout from "@/components/layouts";
import {
    getDirectoryInformation,
    getDomainInformation,
    getMainInformation,
} from "@/hook";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation
import { usePublic } from "@/context/net";

const Assets = () => {
    const [filter, setFilter] = useState("");
    const [currenciesArray, setCurrenciesArray] = useState([]);
    const [net, setNet] = usePublic();
    useEffect(() => {
        const handler = async () => {
            if (filter === "") {
                setCurrenciesArray([]);
                return;
            }

            const assetInfos = localStorage.getItem("asset-" + filter);

            if (!assetInfos) {
                const mainInformation = await getMainInformation(filter);
                const home_domain = mainInformation.home_domain;

                if (!home_domain) {
                    setCurrenciesArray([]);
                    return;
                }

                const domainInformation = await getDomainInformation(home_domain);

                const splittedInformation = domainInformation.split("\n");
                let currencies = false;
                let currencyInfo = {};
                let currencyInfoArray = [];

                for (let i in splittedInformation) {
                    if (splittedInformation[i] === "[[CURRENCIES]]") {
                        currencies = true;
                        continue;
                    }

                    if (!currencies) {
                        continue;
                    }

                    if (splittedInformation[i] === "" && currencies) {
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

                localStorage.setItem(
                    "asset-" + filter,
                    JSON.stringify(currencyInfoArray)
                );
            } else {
                setCurrenciesArray(JSON.parse(assetInfos));
            }
        };

        handler();
    }, [filter]);

    function handleSearch(e) {
        e.preventDefault();

    }

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
                    <div className="text-center double-space">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                className="primary"
                                placeholder="Search assets by code, name, domain, or public key"
                                value={filter}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
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
                                    <Link
                                        title={currency.issuer}
                                        aria-label={currency.issuer}
                                        className="account-address"
                                        href={`/${net}/${currency.issuer}`}
                                        style={{ marginRight: "1em" }}
                                    >
                                        <span className="account-key">
                                            {currency.issuer}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </MainLayout>
    );
};

export default Assets;
