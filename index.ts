import express, { Request, Response } from "express";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { Alchemy, Network } from "alchemy-sdk";

dotenv.config();

const app = express();
const PORT: string | number = process.env.PORT || 3000;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

interface Setting {
  apiKey: string;
  network: Network;
}

const settings: Setting[] = [
  {
    network: Network.ETH_MAINNET,
    apiKey: process.env.ETHEREUM_MAINNET_API_KEY || "",
  },
  {
    network: Network.OPT_MAINNET,
    apiKey: process.env.OPTIMISM_MAINNET_API_KEY || "",
  },
  {
    network: Network.MATIC_MAINNET,
    apiKey: process.env.POLYGON_MAINNET_API_KEY || "",
  },
];

app.use(express.json());

app.get("/getNFTMetadata", async (req: Request, res: Response) => {
  try {
    const { contractAddress, tokenId, network } = req.body;
    const selectedSetting = settings.find(
      (setting) => setting.network === network
    );

    if (!selectedSetting) {
      return res.status(400).json({ error: "Invalid network specified" });
    }

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
      discordUrl: metadata.contract.openSeaMetadata.discordUrl,
    };

    await uploadMetadataToS3(responseObject);

    res.status(200).json(responseObject);
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function uploadMetadataToS3(metadata: any) {
  const metadataString = JSON.stringify(metadata);
  const params = {
    Bucket: "test-part1",
    Key: `nft-metadata/${Date.now()}.txt`,
    Body: metadataString,
    ContentType: "text/plain",
  };
  await s3.upload(params).promise();

  const imageLinkString = metadata.imageUrl;
  const imageLinkParams = {
    Bucket: "test-part1",
    Key: `nft-image-links/${Date.now()}.txt`,
    Body: imageLinkString,
    ContentType: "text/plain",
  };
  await s3.upload(imageLinkParams).promise();
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
