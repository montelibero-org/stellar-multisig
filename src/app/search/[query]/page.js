"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import StellarSdk from 'stellar-sdk';
import MainLayout from "@/components/layouts";
import { usePublic } from "@/context/net";
const SearchResults = () => {
  const router = useRouter();
  const [ net, setNet ] = usePublic();
  const [ account, setAccount] = useState();
  useEffect(() => {
    const pathname = window.location.pathname;
    const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);

    setAccount(accountId);

    return () => { };
}, []);
  const [exists, setExists] = useState(null);
    console.log(net)
  useEffect(() => {
    const checkAccount = async () => {
      const serverUrl =
        net === 'testnet'
          ? 'https://horizon-testnet.stellar.org'
          : 'https://horizon.stellar.org';
      const server = new StellarSdk.Server(serverUrl);

      try {
        await server.loadAccount(account);
        setExists(true);
        // Navigate to the account page if the account exists
        router.push(`/${net}/${account}`);
      } catch (e) {
        if (e instanceof StellarSdk.NotFoundError) {
          setExists(false);
        } else {
          console.error(e);
        }
      }
    };

    if (StellarSdk.StrKey.isValidEd25519PublicKey(account)) {
      console.log('true')
        checkAccount();

    } else {
        setTimeout(() => {
            setExists(false);
        }, 2000);
    }
  }, [net, account]);

  if (exists === true) {
    // Render nothing while waiting for redirection
    return null;
  }

  return (
    <MainLayout>
        <div className="cotainer">
            <div className="search container narrow">
            <h2 className="text-overflow">Search results for "{account}"</h2>
            {exists === null && <p>Loading...</p>}
            {exists === true && <p>Loading...</p>}
            {exists === true && <p>Account "{account}" exists on {net}!</p>}
            {exists === false && <p className="mt-5 text-center">Not found "{account}" on {net}</p>}
            </div>

        </div>
    </MainLayout>
  );
};

export default SearchResults;
