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
  const contractAddress = "0x4933eF805602F6FA6Cf4f3263510c95d30912D69";
  const targetAddress = "0x2924a6C59115299A5945cA1dF6D73ABA526C97bd";
  const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  console.log(`Connected to the wallet ${signer.address}`);
  const balance = await signer.getBalance();  
  console.log(`This address has a balance of ${balance} wei`);
  if (balance.eq(0)) throw new Error("I'm too poor");
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(
       contractAddress
  );
  const tx = await ballotContract.giveRightToVote(targetAddress);
  await tx.wait();
  console.log("Done!");
  console.log(tx.hash);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

