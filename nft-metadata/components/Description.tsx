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
      <div className="flex flex-col mt-5 md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}
