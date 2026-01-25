import { expect } from "chai";
import hre from "hardhat";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";

const { ethers, networkHelpers } = await hre.network.connect();

describe("Coin Flip Test", function () {
  it("Coin Flip block", async () => {
    const [deployer, attacker] = await ethers.getSigners();
    await networkHelpers.setBalance(
      attacker.address,
      ethers.parseEther("1")
    );

    const CoinFlip = await ethers.getContractFactory("CoinFlip", deployer);
    const coinFlip = await CoinFlip.deploy();
    await coinFlip.waitForDeployment();

    const HackCoinFlip = await ethers.getContractFactory(
      "HackCoinFlip",
      attacker
    );
    const hack = await HackCoinFlip.deploy(await coinFlip.getAddress());
    await hack.waitForDeployment();

    for (let i = 0; i < 10; i++) {
      const tx = await hack.makeGuess();
      await tx.wait();

      await networkHelpers.mine(1);
    }

    expect(await coinFlip.consecutiveWins()).to.equal(10);
  });
});
