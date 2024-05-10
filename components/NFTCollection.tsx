'use client';

import { client } from "@/app/client";
import { NFT } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

type NFTCollectionProps = {
    nfts: NFT[];
};

export const NFTCollection = ({ nfts }: NFTCollectionProps) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px",
        }}>
            <h3>AI Generations:</h3>
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                maxWidth: "600px",
            }}>
                {nfts.map((nft) => (
                    <div style={{
                        padding: "5px",
                        width: "150px",
                        height: "150px",
                    }}>
                        <MediaRenderer
                            client={client}
                            src={nft.metadata.image}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "6px",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
};