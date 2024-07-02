import PublicNet from "./publicnet";
import axios from 'axios';

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

export async function generateStaticParams() {
  const accounts = await getAccountIds();
  return accounts.map((account) => ({
    params: { id: account.id },
  }));
}

export default function Page({ params }) {
  return <PublicNet params={params} />;
}
