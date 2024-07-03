"use client";
// src/app/not-found.js
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './not-found.module.css'; // Optional: if you have custom styles
import MainLayout from '@/components/layouts';

const NotFound = () => {
  const pathname = usePathname();
  const accountId = pathname.substring(pathname.lastIndexOf("/") + 1);
  let section = '';
  if (pathname.startsWith('/public')) {
    section = 'Public Section';
  } else if (pathname.startsWith('/testnet')) {
    section = 'Testnet Section';
  }

  return (
    <>{section ? (
        <MainLayout>
            <div className="cotainer">
                <div className={`search error container narrow`} style={{ padding: '20px' }} >
                    <h2 className="text-overflow">Search results for {accountId}</h2>
                    <div>{`"Cannot read properties of null (reading 'invalidAsset')" at ${pathname}`}</div>
                </div>
            </div>
        </MainLayout>
    ) : (
        <MainLayout>
            <div className={styles.container}>
            <h1 className={styles.title}>404 - Page Not Found</h1>
            <p className={styles.description}>
                Sorry, the page you are looking for does not exist.
            </p>
            <Link href="/" legacyBehavior>
                <button className={styles.homeLink}>Go back home</button>
            </Link>
            </div>
        </MainLayout>
    )}
    </>
  );
};

export default NotFound;
