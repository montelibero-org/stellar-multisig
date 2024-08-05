"use client";

import {MainLayout} from "@/widgets";
import {
    getDomainInformation,
    getMainInformation,
} from "@/features/hooks";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";

const Accounts = () => {
    const [filter, setFilter] = useState("");
    const [accountArray, setAccountArray] = useState([]);
    const {net} = useStore(useShallow((state) => ({net: state.net})));
    useEffect(() => {
        const handler = async () => {
            if (filter === "") return;
            const mainInformation = await getMainInformation(filter);
            const home_domain = mainInformation.home_domain;

            if (!home_domain) return;

            const domainInformation = await getDomainInformation(home_domain);

            const splittedInformation = domainInformation.split("\n");
            let accounts = false;
            let accountInfo = {};
            let accountInfoArray = [];

            for (let i in splittedInformation) {
                if (splittedInformation[i] === "[[CURRENCIES]]") {
                    accounts = true;
                    continue;
                }

                if (!accounts) {
                    continue;
                }

                if (splittedInformation[i] === "" && accounts) {
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
                    <div className="text-center double-space">
                        <form>
                            <input
                                type="text"
                                className="primary"
                                placeholder="Search accounts by name, domain, or public key"
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
                                    <Link
                                        title={account.issuer}
                                        aria-label={account.issuer}
                                        className="account-address"
                                        href={`/${net}/${account.issuer}`}
                                        style={{ marginRight: "1em" }}
                                    >
                                        <span className="account-key">
                                            {account.issuer}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="grid-actions text-center space relative">
                        <div className="button-group">
                            <button className="button disabled">
                                Prev Page
                            </button>
                            <button className="button disabled">
                                Next Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Accounts;
