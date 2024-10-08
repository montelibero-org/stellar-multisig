"use client";

import cacheConfig from "@/shared/configs/cache-config.json";
import { Server } from "stellar-sdk";

const horizonURI = "https://horizon.stellar.org";
const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
const server = new Server(horizonURI);

// Function to get and cache main account information
export const getMainInformation = async (accountId: string) => {
  try {
    const mainInformation = localStorage.getItem("main-" + accountId);
    const dateInformationMain = localStorage.getItem("date-" + accountId);

    if (mainInformation && !dateInformationMain) {
      const result = await server.loadAccount(accountId);
      localStorage.setItem("main-" + accountId, JSON.stringify(result));
      localStorage.setItem(
        "date-" + accountId,
        new Date().getTime().toString()
      );
      return result;
    }

    // If data is cached and it has not expired, return cached data
    if (mainInformation && dateInformationMain) {
      const cacheDuration = cacheConfig.stellarDataCacheDurationMs;
      const isCacheValid =
        new Date().getTime() - Number(dateInformationMain) < cacheDuration;
      if (isCacheValid) {
        return JSON.parse(mainInformation);
      }
    }

    const result = await server.loadAccount(accountId);
    localStorage.setItem("main-" + accountId, JSON.stringify(result));
    localStorage.setItem("date-" + accountId, new Date().getTime().toString());
    return result;
  } catch (error) {
    console.error("Error fetching main information:", error);
    return [];
  }
};

// Function to fetch account issuer information
export const getAccountIssuerInformation = async (accountId: string) => {
  try {
    const issuerInformation = localStorage.getItem("issuer-" + accountId);
    const dateInformationIssuer = localStorage.getItem("date-" + accountId);

    if (issuerInformation && !dateInformationIssuer) {
      const result = await server.assets().forIssuer(accountId).call();
      localStorage.setItem("issuer-" + accountId, JSON.stringify(result));
      localStorage.setItem(
        "date-" + accountId,
        new Date().getTime().toString()
      );
      return result;
    }

    if (issuerInformation && dateInformationIssuer) {
      const cacheDuration = cacheConfig.stellarDataCacheDurationMs;
      const isCacheValid =
        new Date().getTime() - Number(dateInformationIssuer) < cacheDuration;
      if (isCacheValid) {
        return JSON.parse(issuerInformation);
      }
    }

    const result = await server.assets().forIssuer(accountId).call();
    localStorage.setItem("issuer-" + accountId, JSON.stringify(result));
    localStorage.setItem("date-" + accountId, new Date().getTime().toString());
    return result;
  } catch (e) {
    console.error("Error fetching issuer information:", e);
    return [];
  }
};

// Function to fetch domain information from Stellar TOML file
export const getDomainInformation = async (domain: string) => {
  try {
    const domainInformation: string | null = localStorage.getItem("domain-" + domain);
    const dateInformationDomain = localStorage.getItem("date-" + domain);

    if (domainInformation && dateInformationDomain) {
      const cacheDuration = cacheConfig.stellarTomlCacheDurationMs;
      const isCacheValid =
        new Date().getTime() - Number(dateInformationDomain) < cacheDuration;
      if (isCacheValid) {
        return domainInformation;
      }
    }

    const url = `https://${domain}/.well-known/stellar.toml`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch domain information: ${response.statusText}`);
    }
    const text = await response.text();
    localStorage.setItem("domain-" + domain, text);
    localStorage.setItem("date-" + domain, new Date().getTime().toString());
    return text;
  } catch (e) {
    console.error("Error fetching domain information:", e);
    return "";
  }
};


// Function to fetch directory information from Stellar API
export const getDirectoryInformation = async () => {
  try {
    const result = await fetch(apiStellarURI);
    const json = await result.json();
    return json;
  } catch (e) {
    console.error("Error fetching directory information:", e);
    return {};
  }
};
