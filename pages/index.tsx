// pages/index.tsx

import { useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  useEffect(() => {
    const generateNFTs = async () => {
      try {
        await axios.get('/api/generateNFTs');
        console.log('NFTs generated and minted successfully');
      } catch (error) {
        console.error('Error generating and minting NFTs:', error);
      }
    };

    generateNFTs();
  }, []);

  return (
    <div>
      <h1>Ikigai Labs Gen Art Series</h1>
      <p>Check the console for logs</p>
    </div>
  );
};

export default HomePage;
