// pages/api/generateNFTs.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas } from 'canvas';
import fs from 'fs';
import { generateMnemonic, Wallet, ChainId, NonceManager, providers } from 'thirdweb';

const NFT_COUNT = 69;
const OUTPUT_FOLDER = 'nfts';
const METADATA_FOLDER = 'metadata';

export default async function generateNFTs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Create the output and metadata folders if they don't exist
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
  }

  if (!fs.existsSync(METADATA_FOLDER)) {
    fs.mkdirSync(METADATA_FOLDER);
  }

  // Initialize Thirdweb wallet and provider
  const mnemonic = generateMnemonic();
  const wallet = new Wallet(mnemonic, {
    chainId: ChainId.Goerli,
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  });
  const provider = new providers.Provider(wallet, {
    chainId: ChainId.Goerli,
    rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  });
  const nonceManager = new NonceManager(wallet, provider);

  for (let i = 0; i < NFT_COUNT; i++) {
    const canvasWidth = 1600;
    const canvasHeight = 900;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    // Generate the artwork using canvas API and Mark Rothko colors
    // Update the artwork generation logic based on your desired style

    // Save the canvas as an image
    const fileName = `nft-${i}.png`;
    const outputPath = `${OUTPUT_FOLDER}/${fileName}`;
    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(outputPath);
    stream.pipe(out);

    // Generate and save metadata
    const metadata = {
      name: `NFT ${i}`,
      description: 'Living the Dream Life',
      edition: `Edition ${i}`,
      artist: 'Your Name',
      // Add more metadata attributes as needed
    };
    const metadataFileName = `metadata-${i}.json`;
    const metadataOutputPath = `${METADATA_FOLDER}/${metadataFileName}`;
    fs.writeFileSync(metadataOutputPath, JSON.stringify(metadata, null, 2));

    // Mint the NFT using Thirdweb SDK
    try {
      const metadataURI = `https://your-website.com/metadata/${metadataFileName}`; // Update with your actual metadata URI
      const tx = await wallet.mintNFT({
        to: wallet.address,
        tokenId: i,
        metadataURI,
        chainId: ChainId.Goerli,
        nonceManager,
      });
      console.log(`NFT ${i} minted successfully. Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error(`Error minting NFT ${i}:`, error);
    }
  }

  res.status(200).json({ message: 'NFTs generated and minted successfully' });
}
