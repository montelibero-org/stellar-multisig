// utils/network.js
"use client";

import { Server } from "stellar-sdk";
import cacheConfig from './cache-config.json';

const horizonURI = "https://horizon.stellar.org";
const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
const server = new Server(horizonURI);

// Function to fetch main account information
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
        }, cacheConfig.stellarDataCacheDurationMs); // Cache duration for Stellar data in milliseconds (1 minute)

        return result;
    } catch (e) {
        return [];
    }
};

// Function to fetch account issuer information
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
        }, cacheConfig.stellarDataCacheDurationMs); // Cache duration for Stellar data in milliseconds (1 minute)

        return result;
    } catch (e) {
        return [];
    }
};

// Function to fetch domain information from Stellar TOML file
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
        }, cacheConfig.stellarTomlCacheDurationMs); // Cache duration for Stellar TOML files in milliseconds (10 minutes)

        return text;
    } catch (e) {
        return "";
    }
};

// Function to fetch directory information from Stellar API
export const getDirectoryInformation = async (accountId) => {
    const result = await fetch(apiStellarURI);
    const json = await result.json();

    return json;
};
