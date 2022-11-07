import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

async function main() {
    const contractAddress = "0xE684E017d41D4AB9F924a572a316C4BEa9e4152f"
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
   const ballotContractFactory = new Ballot__factory(signer);
    // QUESTION: HOW TO CONNECT WITHOUT SIGNER TO READ ONLY DATA?
    const ballotContract = ballotContractFactory.attach(
      contractAddress
    );
    const tx = await ballotContract.winnerName(); 
    const tx1 = await ballotContract.winningProposal();
    console.log("The winning proposal is:");
    console.log(ethers.utils.parseBytes32String(tx));
    console.log("The winning proposal has the following # of votes:");
    console.log(tx1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});