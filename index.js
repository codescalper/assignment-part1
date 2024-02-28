// 1. Microservice Architecture:
// - Design a microservice architecture using suitable technologies and frameworks.
// - The microservice should be designed to handle requests for updating NFT information
// and images across various blockchain networks.
// 2. NFT Update Functionality:
// - Implement functionality to update NFT information based on a provided address.
// - Utilize the Alchemy API to fetch NFT data for the given address.
// - Update NFT metadata including `tokenId`, `title`, `description`, `openseaLink`, `address`,
// `permaLink`, `chainId`, `ownerAddress`, `creators`, and `ownerId`.
// 3. Image Upload to S3:
// - Upon updating NFT information, retrieve the image link from the Alchemy API.
// - Upload the image to an S3 bucket.
// - Store the S3 image link (`imageLink`) along with other NFT metadata.
// 4. Supported Blockchains:
// - Ensure the microservice supports updating NFTs across Ethereum, Polygon, Zora, and
// Optimism networks.
const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();``
const { Alchemy, Network } = require('alchemy-sdk')

const app = express();
const PORT = process.env.PORT || 3000;


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, 
});







const setting =  {
  apiKey: process.env.ETHEREUM_MAINNET_API_KEY,
  network: Network.ETH_MAINNET,
};

const settings = [
  {
    network: Network.ETH_MAINNET,
    apiKey: process.env.ETHEREUM_MAINNET_API_KEY
  },
  {
    network: Network.OPT_MAINNET,
    apiKey: process.env.OPTIMISM_MAINNET_API_KEY,
  },
  {
    network: Network.MATIC_MAINNET,
    apiKey: process.env.POLYGON_MAINNET_API_KEY,
  }
];

// const settign
app.use(express.json());



  app.get('/getNFTMetadata', async (req, res) => {
    try {
      const { contractAddress, tokenId , network  } = req.body;
      const selectedSetting = settings.find(setting => setting.network === network);

      if (!selectedSetting) {
          return res.status(400).json({ error: 'Invalid network specified' });
      }

      // Initialize Alchemy with the selected setting
      const alchemy = new Alchemy(selectedSetting);
  
      const metadata = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
      const responseObject = {
        address: metadata.contract.address,
        name: metadata.contract.name,
        totalSupply: metadata.contract.totalSupply,
        symbol: metadata.contract.symbol,
        tokenType: metadata.contract.tokenType,
        contractDeployer: metadata.contract.contractDeployer,
        twitterUsername: metadata.contract.openSeaMetadata.twitterUsername,
        description: metadata.contract.openSeaMetadata.description,
        imageUrl: metadata.contract.openSeaMetadata.imageUrl,
        discordUrl: metadata.contract.openSeaMetadata.discordUrl
    };
    
      await uploadMetadataToS3(responseObject);

      res.status(200).json(responseObject);

    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  );

  async function uploadMetadataToS3(metadata) {
    const metadataString = JSON.stringify(metadata);
    const params = {
      Bucket: 'test-part1',
      Key: `nft-metadata/${Date.now()}.txt`, 
      Body: metadataString,
      ContentType: 'text/plain',
    };
    await s3.upload(params).promise();


    const imageLinkString = metadata.imageUrl;
    const imageLinkParams = {
      Bucket: 'test-part1',
      Key: `nft-image-links/${Date.now()}.txt`, 
      Body: imageLinkString,
      ContentType: 'text/plain',
    };
    await s3.upload(imageLinkParams).promise();
    // Upload image link
   
  }
  

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });