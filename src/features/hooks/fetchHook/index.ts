"use client";

import cacheConfig from "@/shared/configs/cache-config.json";
import { Server } from "stellar-sdk";

const horizonURI = "https://horizon.stellar.org";
const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
const server = new Server(horizonURI);

// Function to get and cache main account information
export const getMainInformation = async (accountId: string) => {
  try {
    console.log(`Fetching main information for account: ${accountId}`);
    const mainInformation = localStorage.getItem("main-" + accountId);
    const dateInformationMain = localStorage.getItem("date-" + accountId);
    
    if (mainInformation && !dateInformationMain) {
      console.log("Main information cached but date information missing");
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
      console.log(`Cache validity: ${isCacheValid}`);
      if (isCacheValid) {
        console.log("Returning cached main information");
        return JSON.parse(mainInformation);
      }
    }

    console.log("Fetching main information from server");
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
    console.log(`Fetching issuer information for account: ${accountId}`);
    const issuerInformation = localStorage.getItem("issuer-" + accountId);
    const dateInformationIssuer = localStorage.getItem("date-" + accountId);
    
    if (issuerInformation && !dateInformationIssuer) {
      console.log("Issuer information cached but date information missing");
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
      console.log(`Cache validity: ${isCacheValid}`);
      if (isCacheValid) {
        console.log("Returning cached issuer information");
        return JSON.parse(issuerInformation);
      }
    }

    console.log("Fetching issuer information from server");
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
    console.log(`Fetching domain information for domain: ${domain}`);
    const domainInformation: string | null = localStorage.getItem("domain-" + domain);
    const dateInformationDomain = localStorage.getItem("date-" + domain);
    
    if (domainInformation && dateInformationDomain) {
      const cacheDuration = cacheConfig.stellarTomlCacheDurationMs;
      const isCacheValid =
        new Date().getTime() - Number(dateInformationDomain) < cacheDuration;
      console.log(`Cache validity: ${isCacheValid}`);
      if (isCacheValid) {
        console.log("Returning cached domain information");
        return domainInformation;
      }
    }

    console.log(`Fetching domain information from URL: https://${domain}/.well-known/stellar.toml`);
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
    console.log("Fetching directory information from Stellar API");
    const result = await fetch(apiStellarURI);
    const json = await result.json();
    return json;
  } catch (e) {
    console.error("Error fetching directory information:", e);
    return {};
  }
};
