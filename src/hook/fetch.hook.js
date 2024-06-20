"use client";

import { Server } from "stellar-sdk";

const horizonURI = "https://horizon.stellar.org";
const server = new Server(horizonURI);

export const getMainInformation = async (accountId) => {
    try {
        const result = await server.loadAccount(accountId);
        return result;
    } catch (e) {
        return [];
    }
};

export const getAccountIssuerInformation = async (accountId) => {
    try {
        const result = await server.assets().forIssuer(accountId).call();

        return result;
    } catch (e) {
        return [];
    }
};

export const getDomainInformation = async (domain) => {
    const url = `https://${domain}/.well-known/stellar.toml`;
    const result = await fetch(url);

    return result.text();
};
