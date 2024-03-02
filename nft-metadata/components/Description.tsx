"use client";
import { TypewriterEffectSmooth  } from "./ui/typewriter-effect";
export default function Description() {
  const words = [
    {
      text: "Get",
    },
    {
      text: "the",
    },
    {
      text: "metadata",
    },
    {
      text: "of",
    },
    {
      text: "NFTs",
      className: "text-orange-500 dark:text-orange-500",
    },
    {
      text: "across",
    },
    {
      text: "different",
    },
    {
      text: "blockchains",
    },
    {
      text: "networks.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[20rem]  ">
      
      <TypewriterEffectSmooth words={words} />
      <p className="text-neutral-600 pr-5 underline underline-offset-4 decoration-orange-500 font-semibold pl-5 text-center  dark:text-neutral-200 text-xs sm:text-base  ">
         Paste the contract address , token ID and select the blockchain network and get the metadata of the NFT.
      </p>
     
    </div>
  );
}
