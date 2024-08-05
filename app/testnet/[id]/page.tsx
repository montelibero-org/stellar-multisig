// pages/public/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import axios from "axios";
import PublicNet from "./testnet"; // Adjust the import path as needed
import StellarSdk from "stellar-sdk";
import { MainLayout } from "@/widgets";
import React from "react";

interface Account {
  id: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

// Fetching account IDs using Stellar Expert API
const getAccountIds = async (): Promise<Account[]> => {
  const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
  try {
    const response = await axios.get(apiStellarURI);
    const accounts = response.data._embedded.records;
    return accounts.map((account: { address: string }) => ({ id: account.address }));
  } catch (error) {
    console.error("Error fetching accounts from Stellar Expert:", error);
    return [];
  }
};

// Function to generate static paths
export const getStaticPaths: GetStaticPaths = async () => {
  const accounts = await getAccountIds();
  const paths = accounts.map((account) => ({
    params: { id: account.id },
  }));

  return {
    paths,
    fallback: 'blocking', // or false if you want to return 404 for non-generated paths
  };
};

// Function to generate static props
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  if (!params?.id || !StellarSdk.StrKey.isValidEd25519PublicKey(params.id as string)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: {
        id: params.id as string,
      },
    },
  };
};

// Page component
const Page: React.FC<PageProps> = ({ params }) => {
  if (!StellarSdk.StrKey.isValidEd25519PublicKey(params.id)) {
    return (
      <MainLayout>
        <div className="container">
          <div
            className={`search error container narrow`}
            style={{ padding: "20px" }}
          >
            <h2 className="text-overflow">
              Search results for {params.id}
            </h2>
            <div>User ID not found or invalid.</div>
          </div>
        </div>
      </MainLayout>
    );
  }
  return <PublicNet params={params} />;
};

export default Page;