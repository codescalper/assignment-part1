"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const alchemy_sdk_1 = require("alchemy-sdk");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const settings = [
    {
        network: alchemy_sdk_1.Network.ETH_MAINNET,
        apiKey: process.env.ETHEREUM_MAINNET_API_KEY || "",
    },
    {
        network: alchemy_sdk_1.Network.OPT_MAINNET,
        apiKey: process.env.OPTIMISM_MAINNET_API_KEY || "",
    },
    {
        network: alchemy_sdk_1.Network.MATIC_MAINNET,
        apiKey: process.env.POLYGON_MAINNET_API_KEY || "",
    },
];
app.use(express_1.default.json());
app.get("/getNFTMetadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contractAddress, tokenId, network } = req.body;
        const selectedSetting = settings.find((setting) => setting.network === network);
        if (!selectedSetting) {
            return res.status(400).json({ error: "Invalid network specified" });
        }
        const alchemy = new alchemy_sdk_1.Alchemy(selectedSetting);
        const metadata = yield alchemy.nft.getNftMetadata(contractAddress, tokenId);
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
        yield uploadMetadataToS3(responseObject);
        res.status(200).json(responseObject);
    }
    catch (error) {
        console.error("Error fetching NFT metadata:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
function uploadMetadataToS3(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadataString = JSON.stringify(metadata);
        const params = {
            Bucket: "test-part1",
            Key: `nft-metadata/${Date.now()}.txt`,
            Body: metadataString,
            ContentType: "text/plain",
        };
        yield s3.upload(params).promise();
        const imageLinkString = metadata.imageUrl;
        const imageLinkParams = {
            Bucket: "test-part1",
            Key: `nft-image-links/${Date.now()}.txt`,
            Body: imageLinkString,
            ContentType: "text/plain",
        };
        yield s3.upload(imageLinkParams).promise();
    });
}
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
