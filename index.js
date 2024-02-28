// 1. Microservice Architecture:
// - Design a microservice architecture using suitable technologies and frameworks.
// - The microservice should be designed to handle requests for updating NFT information
// and images across various blockchain networks.
// 2. NFT Update Functionality:
// - Implement functionality to update NFT information based on a provided address.
// - Utilize the Alchemy API to fetch NFT data for the given address.
// - Update NFT metadata including `tokenId`, `title`, `description`, `openseaLink`, `address`,
// `permaLink`, `chainId`, `ownerAddress`, `creators`, and `ownerId`.
// 3. mage Upload to S3:
// - Upon updating NFT information, retrieve the image link from the Alchemy API.
// - Upload the image to an S3 bucket.
// - Store the S3 image link (`imageLink`) along with other NFT metadata.
// 4. Supported Blockchains:
// - Ensure the microservice supports updating NFTs across Ethereum, Polygon, Zora, and
// Optimism networks.
const express = require('express');
const axios = require('axios');
const AWS = require('aws-sdk');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;

const alchemyApiKeys = {
    ethereum: 'V57bd8iuxrYBPQgmL3Lyca4lU3ObFrCK',
    arbitrum: 'hJZSNru5E-8XUsVc1EQFyPycmbuBfDZm',
    polygon: 'dSjs5NoyyV2JChj8LJZVIttkP1RFNULb',
  };


const s3 = new AWS.S3({
    accessKeyId: 'AKIATCKARGLER2DQXFEB',
    secretAccessKey: '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',
    region: 'eu-north-1', 
  });

const mongoUrl = 'mongodb+srv://msfunbook:n6393NiYJtMKVJuS@cluster0.esdby6d.mongodb.net/'
const dbName = 'nft_db';

app.use(express.json());

app.post('/update-nft', async (req, res) => {
    try {
      const {  address, network } = req.body;
  
     
      const nftData = await fetchNftData(address,network);
  
      await updateNftMetadata(nftData);
  
      await uploadImageToS3(nftData.imageLink);
  
      res.status(200).json({ message: 'NFT updated successfully' });
    } catch (error) {
      console.error('Error updating NFT:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/update-nft', async (req, res) => {
    try {
      const { address, network } = req.body;
  
      const nftData = await fetchNftData(address, network);
  
      await updateNftMetadata(nftData);
  
      await uploadImageToS3(nftData.imageLink);
  
      res.status(200).json({ message: 'NFT updated successfully' });
    } catch (error) {
      console.error('Error updating NFT:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/',(req,res)=>{
        res.send('Welcome to NFT Microservice')
    
  })
  
  async function fetchNftData(address, network) {
    const alchemyUrl = `https://api.alchemyapi.io/v2/${alchemyApiKeys[network]}/nft/${address}`;
    const response = await axios.get(alchemyUrl);
    return response.data;
  }

  async function updateNftMetadata(nftData) {
    const client = new MongoClient(mongoUrl, { useNewUrlParser: true });
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('nfts');
    await collection.updateOne({ tokenId: nftData.tokenId }, { $set: nftData }, { upsert: true });
    client.close();
  }
  

  async function uploadImageToS3(imageLink) {
    const imageBuffer = await axios.get(imageLink, { responseType: 'arraybuffer' });
    const params = {
      Bucket: 'test-part1',
      Key: `nft-images/${Date.now()}.jpg`, 
      Body: imageBuffer.data,
      ContentType: 'image/jpeg',
    };
    await s3.upload(params).promise();
  }


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });