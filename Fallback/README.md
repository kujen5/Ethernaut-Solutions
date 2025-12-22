# Overview
I recently launched a blog post series where I will be posting about my journey in Web3/Blockchain security.
During this series, I will be posting about Web3/Blockchain bugs and exploits, alongside writeups for [Ethernaut](https://ethernaut.openzeppelin.com/) and [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) challenges.

You can check [the first 'Hello Ethernaut' Ethernaut challenge here.](https://fouedsaidi.com/2025/12/15/Ethernaut-Hello-Ethernaut)

Today, I am following up on the Ethernaut challenges series presented to us by [OpenZeppelin](https://www.openzeppelin.com/) !

Hope you enjoy it and learn something new!

# 'Fallback' Challenge

## Overview

`Fallback` is the second challenge in [the Ethernaut](https://ethernaut.openzeppelin.com/) series.


[Link to the original challenge.](https://ethernaut.openzeppelin.com/level/1)

[Github repo link that contains challenge code and solver.]()

## Challenge Description

```
Look carefully at the contract's code below.

You will beat this level if

you claim ownership of the contract
you reduce its balance to 0
  Things that might help

How to send ether when interacting with an ABI
How to send ether outside of the ABI
Converting to and from wei/ether units (see help() command)
Fallback methods
```

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fallback {
    mapping(address => uint256) public contributions;
    address public owner;

    constructor() {
        owner = msg.sender;
        contributions[msg.sender] = 1000 * (1 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    function contribute() public payable {
        require(msg.value < 0.001 ether);
        contributions[msg.sender] += msg.value;
        if (contributions[msg.sender] > contributions[owner]) {
            owner = msg.sender;
        }
    }

    function getContribution() public view returns (uint256) {
        return contributions[msg.sender];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        require(msg.value > 0 && contributions[msg.sender] > 0);
        owner = msg.sender;
    }
}
```




### Exploitation Steps
# Conclusion