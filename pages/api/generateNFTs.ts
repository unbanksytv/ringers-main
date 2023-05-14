// pages/api/generateNFTs.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

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

  for (let i = 0; i < NFT_COUNT; i++) {
    const canvasWidth = 1600;
    const canvasHeight = 900;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    // Generate the artwork using canvas API and enhanced creativity techniques
    const backgroundColor = getRandomColor();
    const color1 = getRandomColor();
    const color2 = getRandomColor();

    // Apply background gradient
    const gradient = context.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(1, getRandomColor());
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw abstract shapes
    const numShapes = getRandomInt(3, 6);
    const maxShapeSize = Math.min(canvasWidth, canvasHeight) / 2;

    for (let j = 0; j < numShapes; j++) {
      const shapeSize = getRandomInt(maxShapeSize / 4, maxShapeSize);
      const shapeX = getRandomInt(0, canvasWidth - shapeSize);
      const shapeY = getRandomInt(0, canvasHeight - shapeSize);
      const shapeColor = j % 2 === 0 ? color1 : color2;

      context.fillStyle = shapeColor;
      context.strokeStyle = getRandomColor();
      context.lineWidth = getRandomInt(1, 5);

      // Create a random shape (e.g., circle, rectangle, triangle)
      const shapeType = getRandomShapeType();
      drawShape(context, shapeType, shapeX, shapeY, shapeSize);
    }

    // Save the canvas as an image
    const fileName = `nft-${i}.png`;
    const outputPath = `${OUTPUT_FOLDER}/${fileName}`;
    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(outputPath);
    stream.pipe(out);

    // Generate and save metadata
    const metadata = {
      title: `Gen Art ${i}`,
      description: 'Living the Dream Life',
      edition: `Edition ${i}`,
      artist: 'Ikigai Labs XYZ',
      series: 'Gen Art Series',
      // Add more metadata attributes as needed
    };
    const metadataFileName = `metadata-${i}.json`;
    const metadataOutputPath = `${METADATA_FOLDER}/${metadataFileName}`;
    fs.writeFileSync(metadataOutputPath, JSON.stringify(metadata, null, 2));
  }

  res.status(200).json({ message: 'NFTs generated successfully' });
}

// Helper function to generate a random color
function getRandomColor() {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to generate a random integer within a range
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to draw a random shape
function drawShape(context: CanvasRenderingContext2D, shapeType: string, x: number, y: number, size: number) {
  context.beginPath();

  if (shapeType === 'circle') {
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  } else if (shapeType === 'rectangle') {
    context.rect(x, y, size, size);
  } else if (shapeType === 'triangle') {
    context.moveTo(x + size / 2, y);
    context.lineTo(x, y + size);
    context.lineTo(x + size, y + size);
    context.closePath();
  }

  context.fill();
  context.stroke();
}

// Helper function to get a random shape type
function getRandomShapeType() {
  const shapeTypes = ['circle', 'rectangle', 'triangle'];
  return shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
}

export default generateNFTs;