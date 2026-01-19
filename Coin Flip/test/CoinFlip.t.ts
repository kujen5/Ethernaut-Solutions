import { expect } from "chai";
import hre from "hardhat";
import { defineConfig } from "hardhat/config";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";
const { ethers, networkHelpers } = await hre.network.connect();

export default defineConfig({
  plugins: [hardhatNetworkHelpers],
});

describe("Coin Flip Test", function () {

 it("Coin Flip block", async () => {

  // setup users
  const [deployer, attacker] = await ethers.getSigners();
  await networkHelpers.setBalance(attacker.address, ethers.parseEther("1"));

  // deploy contract
  const Fallback = await ethers.getContractFactory("CoinFlip",deployer);
  const fallback=await Fallback.deploy();
  await fallback.waitForDeployment();


  });
});