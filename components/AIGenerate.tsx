'use client';

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { useState } from "react";
import { ConnectButton, MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { NFTCollection } from "./NFTCollection";
import { getNFTs } from "thirdweb/extensions/erc721";
import { contract } from "../utils/contract";

export const AIGenerate = () => {
    const account = useActiveAccount();
    const [imagePrompt, setImagePrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const { data: nfts, refetch: refetchNFTs } = useReadContract(
        getNFTs,
        {
            contract: contract,
        }
    );

    const handleGenerateAndMint = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            console.log("Generating image");
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imagePrompt
                }),
            });

            console.log("Generated image");
            if(!res.ok) {
                throw new Error("Failed to generate image");
            }

            const data = await res.json();

            setImagePrompt("");

            console.log("Minting NFT");
            const imageBlob = await fetch(data.data[0].url).then((res) => res.blob());

            const file = new File([imageBlob], "image.png", { type: "image/png" });
            const imageUri = await upload({
                client: client,
                files: [file],
            });

            if (!imageUri) {
                throw new Error("Error uploading image to IPFS");
            }
            setGeneratedImage(imageUri);
            setIsGenerating(false);
            setIsMinting(true);
            const mintRes = await fetch("/api/mint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nftImage: imageUri,
                    address: account?.address || "",
                }),
            });

            if(!mintRes.ok) {
                throw new Error("Failed to mint NFT");
            }

            alert("NFT minted successfully");
        } catch (error) {
            console.error(error);
        } finally {
            setIsMinting(false);
            refetchNFTs();
        }
    };

    if(account) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
            }}>
                <ConnectButton 
                    client={client}
                    chain={chain}
                />
                <div>
                    <div style={{ margin: "20px 0"}}>
                        {generatedImage ? (
                            <MediaRenderer
                                client={client}
                                src={generatedImage}
                                style={{
                                    width: "300px",
                                    height: "300px",
                                    borderRadius: "8px",
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "300px",
                                height: "300px",
                                border: "1px dashed #777",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <p style={{ color: "#777" }}>
                                    {isGenerating ? "Generating image..." : "No image generated"}
                                </p>
                            </div>
                        )}
                    </div>
                    <div>
                        <form onSubmit={handleGenerateAndMint}>
                            {!generatedImage || isMinting ? (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter image prompt..."
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                        style={{
                                            width: "300px",
                                            height: "40px",
                                            padding: "0 10px",
                                            borderRadius: "5px",
                                            border: "1px solid #777",
                                            marginBottom: "10px",
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!imagePrompt || isGenerating || isMinting}
                                        style={{
                                            width: "300px",
                                            height: "40px",
                                            backgroundColor: "#333",
                                            color: "#fff",
                                            borderRadius: "5px",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >{isGenerating ? "Generating..." : isMinting ? "Minting..." : "Generate and Mint"}</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setGeneratedImage("")}
                                    style={{
                                        width: "300px",
                                        height: "40px",
                                        backgroundColor: "#333",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >Generate Another NFT</button>
                            )}
                        </form>
                    </div>
                </div>
                <NFTCollection 
                    nfts={nfts || []}
                />
            </div>
        );
    }
};