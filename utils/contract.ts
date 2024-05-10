import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";

export const nftCollectionContractAddress = "<contract_address>";

export const contract = getContract({
    client: client,
    chain: chain,
    address: nftCollectionContractAddress,
});