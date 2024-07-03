// pages/public/[id].js
import axios from 'axios';
import PublicNet from "./publicnet"; // Adjust the import path as needed

// Fetching account IDs using Stellar Expert API
const getAccountIds = async () => {
  const apiStellarURI = "https://api.stellar.expert/explorer/directory?limit=20";
  try {
    const response = await axios.get(apiStellarURI);
    const accounts = response.data._embedded.records;
    return accounts.map(account => ({ id: account.address }));
  } catch (error) {
    console.error('Error fetching accounts from Stellar Expert:', error);
    return [];
  }
};

// Function to generate static params
export async function generateStaticParams() {
  const accounts = await getAccountIds();
  const params = accounts.map(account => ({ id: account.id }));
  return params;
}

// Page component
export default function Page({ params }) {
  return <PublicNet params={params} />;
}
