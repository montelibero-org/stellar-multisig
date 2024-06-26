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
  const [errorvalid, setErrorvalid] = useState('')

  useEffect(() => {
    const pathname = window.location.pathname;
    const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);

    setAccount(accountId);

    return () => { };
}, []);
  const [exists, setExists] = useState(null);
    console.log(net)
  useEffect(() => {
    const pathname = window.location.pathname;
    const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);
    const checkAccount = async () => {
      const serverUrl =
        net === 'testnet'
          ? 'https://horizon-testnet.stellar.org'
          : 'https://horizon.stellar.org';
      const server = new StellarSdk.Server(serverUrl);

      try {
        await server.loadAccount(accountId);
        setExists(true);
        // Navigate to the account page if the account exists
        router.push(`/${net}/${accountId}`);
      } catch (e) {
        if (e instanceof StellarSdk.NotFoundError) {
          setExists(false);
          setErrorvalid('Error: Account does not exist on the network. Make sure that you copied account address correctly and there was at least one payment to this address.')

        } else {
          console.error(e);
        }
      }
    };

    if (StellarSdk.StrKey.isValidEd25519PublicKey(accountId)) {
      console.log('true')
        checkAccount();

    } else {
        setTimeout(() => {
            setExists(false);
        }, 2000);
        setErrorvalid(`"Cannot read properties of null (reading 'invalidAsset')" at ${pathname}`)

    }
  }, [net, account]);

  if (exists === true) {
    // Render nothing while waiting for redirection
    return null;
  }

  return (
    <MainLayout>
        <div className="cotainer">
        <div className={`"search ${exists === false ? 'error': ''} container narrow"`} style={{padding:'20px'}} >

            <h2 className="text-overflow">Search results for "{account}"</h2>
            {exists === null && <p>Loading...</p>}
            {exists === false &&<span>{errorvalid}</span>}
            </div>

        </div>
    </MainLayout>
  );
};

export default SearchResults;
