// utils/network.js
"use client";

import { Server } from "stellar-sdk";
import cacheConfig from './cache-config.json';

const horizonURI = "https://horizon.stellar.org";
const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
const server = new Server(horizonURI);

export const getMainInformation = async (accountId) => {
    try {
        const mainInformation = localStorage.getItem("main-" + accountId);
        if (mainInformation) {
            return JSON.parse(mainInformation);
        }

        const result = await server.loadAccount(accountId);

        localStorage.setItem("main-" + accountId, JSON.stringify(result));

        setTimeout(() => {
            localStorage.removeItem("main-" + accountId);
        }, cacheConfig.mainInformationCacheDuration);

        return result;
    } catch (e) {
        return [];
    }
};

export const getAccountIssuerInformation = async (accountId) => {
    try {
        const issuerInformation = localStorage.getItem("issuer-" + accountId);
        if (issuerInformation) {
            return JSON.parse(issuerInformation);
        }

        const result = await server.assets().forIssuer(accountId).call();

        localStorage.setItem("issuer-" + accountId, JSON.stringify(result));

        setTimeout(() => {
            localStorage.removeItem("issuer-" + accountId);
        }, cacheConfig.issuerInformationCacheDuration);

        return result;
    } catch (e) {
        return [];
    }
};

export const getDomainInformation = async (domain) => {
    try {
        const domainInformation = localStorage.getItem("domain-" + domain);
        if (domainInformation) {
            return domainInformation;
        }
        const url = `https://${domain}/.well-known/stellar.toml`;
        const result = await fetch(url);
        const text = await result.text();

        localStorage.setItem("domain-" + domain, text);

        setTimeout(() => {
            localStorage.removeItem("domain-" + domain);
        }, cacheConfig.domainInformationCacheDuration);

        return text;
    } catch (e) {
        return "";
    }
};

export const getDirectoryInformation = async (accountId) => {
    const result = await fetch(apiStellarURI);
    const json = await result.json();

    return json;
};
