"use client";

import React, { useEffect, useState, useCallback, FC } from "react";
import Link from "next/link";
import { useStore } from "@/features/store";
import { useShallow } from "zustand/react/shallow";
import { MainLayout } from "@/widgets";
import { getDomainInformation, getMainInformation } from "@/features/hooks";

interface CurrencyInfo {
  name: string;
  code: string;
  issuer: string;
  anchor_asset_type: string;
  [key: string]: string;
}

const Assets: FC = () => {
  const [filter, setFilter] = useState<string>("");
  const [currenciesArray, setCurrenciesArray] = useState<CurrencyInfo[]>([]);
  const { net } = useStore(useShallow((state) => ({ net: state.net })));

  const fetchAssetInfo = useCallback(async (filter: string) => {
    if (filter === "") {
      setCurrenciesArray([]);
      return;
    }

    const cachedAssetInfo = localStorage.getItem(`asset-${filter}`);

    if (cachedAssetInfo) {
      setCurrenciesArray(JSON.parse(cachedAssetInfo));
      return;
    }

    const mainInformation = await getMainInformation(filter);
    const { home_domain } = mainInformation;

    if (!home_domain) {
      setCurrenciesArray([]);
      return;
    }

    const domainInformation = await getDomainInformation(home_domain);
    const currencyInfoArray = parseDomainInformation(domainInformation);

    setCurrenciesArray(currencyInfoArray);
    localStorage.setItem(`asset-${filter}`, JSON.stringify(currencyInfoArray));
  }, []);

  useEffect(() => {
    fetchAssetInfo(filter);
  }, [filter, fetchAssetInfo]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <MainLayout>
      <div className="container narrow">
        <h2>Trusted MTL Assets</h2>
        <div className="text-right mobile-left" style={{ marginTop: "-2.2em" }}>
          <a href="#" className="icon icon-github" title="Log in with Github" style={{ fontSize: "1.4em" }}></a>
        </div>
        <div className="segment blank directory">
          <div className="text-center double-space">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                className="primary"
                placeholder="Search assets by code, name, domain, or public key"
                value={filter}
                onChange={handleFilterChange}
                style={{ maxWidth: "36em" }}
              />
            </form>
            <div>
              <div className="dimmed text-small">Filter by tag:</div>
              <div className="row">
                <div className="column column-25">
                  <a className="tag-block" href="#exchange">#exchange</a>
                </div>
              </div>
            </div>
          </div>
          <ul className="striped space">
            {currenciesArray.map((currency, index) => (
              <CurrencyListItem key={index} currency={currency} net={net} />
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

const CurrencyListItem: React.FC<{ currency: CurrencyInfo; net: string }> = ({ currency, net }) => (
  <li style={{ padding: "1em", lineHeight: "1.6", overflow: "hidden" }}>
    <div>
      <b>{currency.name}({currency.code})</b>{" "}
      <a href="https://null" className="text-small"></a>
      <a className="inline-tag" href="#">#{currency.anchor_asset_type}</a>
    </div>
    <Link
      title={currency.issuer}
      aria-label={currency.issuer}
      className="account-address"
      href={`/${net}/${currency.issuer}`}
      style={{ marginRight: "1em" }}
    >
      <span className="account-key">{currency.issuer}</span>
    </Link>
  </li>
);

function parseDomainInformation(domainInformation: string): CurrencyInfo[] {
  const lines = domainInformation.split("\n");
  let currencies = false;
  let currencyInfo: Partial<CurrencyInfo> = {};
  const currencyInfoArray: CurrencyInfo[] = [];

  for (const line of lines) {
    if (line === "[[CURRENCIES]]") {
      currencies = true;
      continue;
    }

    if (!currencies) continue;

    if (line === "" && currencies) {
      currencies = false;
      if (Object.keys(currencyInfo).length > 0) {
        currencyInfoArray.push(currencyInfo as CurrencyInfo);
        currencyInfo = {};
      }
      continue;
    }

    const [key, value] = line.split("=").map(part => part.trim());
    if (key && value) {
      currencyInfo[key] = value.replace(/"/g, "");
    }
  }

  return currencyInfoArray;
}

export default Assets;