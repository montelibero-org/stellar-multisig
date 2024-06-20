"use client";

import { Server } from "stellar-sdk";

const horizonURI = "https://horizon.stellar.org";
const server = new Server(horizonURI);

export const getMainInformation = async (accountId) => {
    const result = await server.loadAccount(accountId);
    return result;
};

export const getAccountIssuerInformation = async (accountId) => {
    const result = await server.assets().forIssuer(accountId).call();

    return result;
};

export const getStellarDomain = async (type, domain) => {
    const url = `https://api.stellar.expert/explorer/${type}/domain-meta?domain=${domain}`;
    const result = await fetch(url);

    return result.json();
};
