"use client";

import cacheConfig from "@/shared/configs/cache-config.json";
import { Server } from 'stellar-sdk';

const horizonURI = "https://horizon.stellar.org";
const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
const server = new Server(horizonURI);

export const getMainInformation = async (accountId: string) => {
    try {
        const mainInformation = localStorage.getItem("main-" + accountId);
        if (mainInformation) return JSON.parse(mainInformation);
        const result = await server.loadAccount(accountId);
        localStorage.setItem("main-" + accountId, JSON.stringify(result));
        setTimeout(
            () => localStorage.removeItem("main-" + accountId),
            cacheConfig.stellarDataCacheDurationMs
        ); // Cache duration for Stellar data in milliseconds (1 minute)
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
};

// Function to fetch account issuer information
export const getAccountIssuerInformation = async (accountId: string) => {
    try {
        const issuerInformation = localStorage.getItem("issuer-" + accountId);
        if (issuerInformation) return JSON.parse(issuerInformation);
        const result = await server.assets().forIssuer(accountId).call();
        localStorage.setItem("issuer-" + accountId, JSON.stringify(result));
        setTimeout(
            () => localStorage.removeItem("issuer-" + accountId),
            cacheConfig.stellarDataCacheDurationMs
        );
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
};

// Function to fetch domain information from Stellar TOML file
export const getDomainInformation = async (domain: string) => {
    try {
        const domainInformation = localStorage.getItem("domain-" + domain);
        if (domainInformation) return domainInformation;
        const url = `https://${domain}/.well-known/stellar.toml`;
        const result = await fetch(url);
        const text = await result.text();
        localStorage.setItem("domain-" + domain, text);
        setTimeout(
            () => localStorage.removeItem("domain-" + domain),
            cacheConfig.stellarTomlCacheDurationMs
        ); // Cache duration for Stellar TOML files in milliseconds (10 minutes)
        return text;
    } catch (e) {
        console.error(e);
        return "";
    }
};

// Function to fetch directory information from Stellar API
export const getDirectoryInformation = async () => {
    const result = await fetch(apiStellarURI);
    const json = await result.json();
    return json;
};
