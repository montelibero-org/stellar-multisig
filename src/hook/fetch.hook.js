"use client";

import { Server } from "stellar-sdk";

const horizonURI = "https://horizon.stellar.org";
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
        }, 100000);

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
        }, 100000);

        return result;
    } catch (e) {
        return [];
    }
};

export const getDomainInformation = async (domain) => {
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
    }, 100000);

    return text;
};
