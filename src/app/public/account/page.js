"use client";

import MainLayout from "@/components/layouts";
import {
    getDirectoryInformation,
    getDomainInformation,
    getMainInformation,
} from "@/hook";
import React, { useEffect, useState } from "react";

const Account = () => {
    const [filter, setFilter] = useState("");
    const [accountArray, setAccountArray] = useState([]);

    useEffect(() => {
        const handler = async () => {
            if (filter == "") return;
            const mainInformation = await getMainInformation(filter);
            const home_domain = mainInformation.home_domain;

            if (!home_domain) return;

            const domainInformation = await getDomainInformation(home_domain);

            const splittedInformation = domainInformation.split("\n");
            let accounts = false;
            let accountInfo = {};
            let accountInfoArray = [];

            for (let i in splittedInformation) {
                if (splittedInformation[i] == "[[CURRENCIES]]") {
                    accounts = true;
                    continue;
                }

                if (!accounts) {
                    continue;
                }

                if (splittedInformation[i] == "" && accounts) {
                    accounts = false;
                    accountInfoArray.push(accountInfo);
                    accountInfo = {};
                    continue;
                }

                const _pattern = splittedInformation[i].split("=");
                accountInfo[_pattern[0].trim()] = _pattern[1]
                    .replace(/"/g, "")
                    .trim();
            }

            setAccountArray(accountInfoArray);
        };

        handler();
    }, [filter]);

    return (
        <MainLayout>
            <div className="container narrow">
                <h2>Trusted MTL Accounts</h2>
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
                        The list of Trusted MTL Accounts.
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
                    </div>
                    <ul className="striped space">
                        {accountArray?.map((account, index) => {
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
                                        <b>{account.name}</b>{" "}
                                    </div>
                                    <a
                                        title={account.issuer}
                                        aria-label={account.issuer}
                                        className="account-address"
                                        href={`/public/${account.issuer}`}
                                        style={{ marginRight: "1em" }}
                                    >
                                        <span className="account-key">
                                            {account.issuer}
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

export default Account;
