// pages/_app.tsx

import '../styles/globals.css';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Import the 'canvas' module in the browser environment
    import('canvas').catch((err) => {
      console.error("Failed to import 'canvas':", err);
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
