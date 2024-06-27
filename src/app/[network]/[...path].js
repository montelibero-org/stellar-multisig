// src/app/[network]/[...path].js
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const NetworkPage = () => {
  const router = useRouter();
  const { network, path = [] } = router.query;

  useEffect(() => {
    if (router.asPath.endsWith('/')) {
      const newPath = router.asPath.slice(0, -1);
      router.replace(newPath);
    }
  }, [router.asPath]);

  // Default to 'public' if the network is not recognized
  const validNetwork = network === 'public' || network === 'test' ? network : 'public';

  // Dynamically import the correct component based on the network and path
  const DynamicComponent = dynamic(() =>
    import(`../${validNetwork}/${path.length > 0 ? path.join('/') : 'page'}`).catch(() => import(`../${validNetwork}/page`))
  );

  return <DynamicComponent />;
};

export default NetworkPage;
