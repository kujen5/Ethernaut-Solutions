import hre from "hardhat";
import "dotenv/config";
const { ethers, networkHelpers } = await hre.network.connect();

async function main() {
  const instanceAddress = "0x30512bC277847b5975934e106D07168460016782";

  const contractAbi = [
    "function info() view returns (string)",
    "function info1() view returns (string)",
    "function info2(string) view returns (string)",
    "function infoNum() view returns (uint8)",
    "function info42() view returns (string)",
    "function theMethodName() view returns (string)",
    "function method7123949() view returns (string)",
    "function password() view returns (string)",
    "function authenticate(string)"
  ];

  const hello = await ethers.getContractAt(contractAbi, instanceAddress);

  console.log("info() Output :", await hello.info());
  console.log("info1() Output :", await hello.info1());
  console.log("info2('hello') Output :", await hello.info2("hello"));
  console.log("infoNum() Output :", Number(await hello.infoNum()));
  console.log("info42() Output :", await hello.info42());
  console.log("theMethodName() Output :", await hello.theMethodName());
  console.log("method7123949() Output :", await hello.method7123949());

  const password = await hello.password();
  console.log("password() :", password);

  console.log("\n[+] Sending authenticate transaction.");
  const tx = await hello.authenticate(password);
  console.log("[+] Tx submitted  :", tx.hash);
  await tx.wait();

  console.log("\n[+] Level 0 completed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});