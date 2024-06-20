"use client";

import { Server } from "stellar-sdk";

const stellarExpertApi = "https://stellar-multisig-server-jbwvw8k9o-lorexabcs-projects.vercel.app/api/stellar/";
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

export const getStellarAccount = async (type, accountId) => {
    const params = "account";
    const result = await fetch(stellarExpertApi + params, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type,
            accountId,
        }),
    });

    return result;
};

export const getStellarValues = async (type, accountId) => {
    const params = "account-value";
    const result = await fetch(stellarExpertApi + params, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type,
            accountId,
        }),
    });

    return result;
};