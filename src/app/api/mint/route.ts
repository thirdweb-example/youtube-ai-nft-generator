import { NextRequest, NextResponse } from "next/server";
import { nftCollectionContractAddress } from "../../../../utils/contract";

const {
    ENGINE_URL,
    THIRDWEB_SECRET_KEY,
    BACKEND_WALLET_ADDRESS,
    CHAIN_ID,
} = process.env;

export async function POST(req: NextRequest) {
    console.log('Minting NFT');
    if(!ENGINE_URL || !THIRDWEB_SECRET_KEY || !BACKEND_WALLET_ADDRESS || !CHAIN_ID) {
        return new NextResponse(
            JSON.stringify({ error: "Missing required environment variables" }),
            { status: 500 }
        );
    }

    const { nftImage, address } = await req.json();
    
    try {
        const mintResponse = await fetch(
            `${ENGINE_URL}/contract/${CHAIN_ID}/${nftCollectionContractAddress}/erc721/mint-to`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
                    "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
                },
                body: JSON.stringify({
                    receiver: address,
                    metadata: {
                        name: "AI NFT",
                        description: `"AI generated NFT"`,
                        image: nftImage,
                    }
                })
            }
        );

        if (!mintResponse.ok) {
            const error = await mintResponse.text();
            throw new Error(`Failed to mint NFT: ${error}`);
        }

        return new NextResponse(JSON.stringify({ message: "NFT minted successfully" }), { status: 200 });
    } catch (error) {
        console.error('Minting error:', error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to mint NFT" }),
            { status: 500 }
        );
    }
};
