import { ConnectEmbed } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { AIGenerate } from "../../components/AIGenerate";

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: "20px",
    }}>
      <h1 style={{ margin: "20px" }}>AI NFT Generator</h1>
      <ConnectEmbed
        client={client}
        chain={chain}
      />
      <AIGenerate />
    </div>
  );
}
