import { ethers } from "ethers";
import { threadId } from "worker_threads";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config()

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  const proposals = process.argv.slice(2);
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  console.log(`Connected to the wallt ${signer.address}`);
  const balance = await signer.getBalance();  
  console.log(`This address has a balance of ${balance} wei`);
  if (balance.eq(0)) throw new Error("I'm too poor");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
       convertStringArrayToBytes32(proposals)
  );
  await ballotContract.deployed();
  console.log(`The ballot smart contract was deployed at ${ballotContract.address}}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

