# Overview

Hello everyone, I hope you are doing fantastic!

This is Foued SAIDI (0xkujen), senior pentester and a wannabe Web3/Blockhain Security Researcher.

A few days ago I launched a blog post series where I will be posting about my journey in Web3/Blockchain security. You can read [the first blog post about Damn Vulnerable DeFi challenges](https://fouedsaidi.com/2025/12/10/Damn-Vulnerable-DeFi-V4-Unstoppable/).

Today, I am following up on the [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) series and challenging myself even more by finishing the [Ethernaut challenges](https://ethernaut.openzeppelin.com/) series presented to us by [OpenZeppelin](https://www.openzeppelin.com/)!

Hope you enjoy it and learn something new!


# 'Hello Ethernaut' Challenge

## Challenge Description

### Overview

`Hello Ethernaut` is the very first challenge in [the Ethernaut](https://ethernaut.openzeppelin.com/) series. It serves basically as an introduction to the system of the challenges and how to interact with the smart contracts etc.

The `Hello Ethernaut` challenge is pretty basic as it simply teaches you how to interact with the contract through your browser developer tools.

### Exploitation Steps - Developer Tools

1. First of all, we will deploy a new contract for us to interact with by pressing `Get new instance` (don't forget to create a [Metamask wallet](https://metamask.io/) if you don't have one):
![Launch instance](images/1.png)

This will prompt us with an authorization window from Metamask:
![Metamask](images/2.png)

2. After we launch the instance, we must open developer tools on our browser to interact with the contract. We can do so by pressing `Shift + Ctrl + I`. We will find this welcome message from from the contract:

![Welcome message](images/3.png)

```javascript
Hello Ethernaut
Type help() for a listing of custom web3 addons
=> Level address 0x7E0f53981657345B31C59aC44e9c21631Ce710c7
(●*∩_∩*●) Requesting new instance from level... <  < <<PLEASE WAIT>> >  >
=> Instance address 0x9A49046252239bfc3D5c6a502f804Dd262d485e1
```

3. The contract address we will be interacting with is `0x9A49046252239bfc3D5c6a502f804Dd262d485e1`. We can even check it from [Etherscan for the Sepolia chain](https://sepolia.etherscan.io/address/0x9A49046252239bfc3D5c6a502f804Dd262d485e1).

4. Now typing help to see what we can do:

```javascript
->help()
player	'current player address'
ethernaut	'main game contract'
level	'current level contract address'
contract	'current level contract instance (if created)'
instance	'current level instance contract address (if created)'
version	'current game version'
getBalance(address)	'gets balance of address in ether'
getBlockNumber()	'gets current network block number'
sendTransaction({options})	'send transaction util'
getNetworkId()	'get ethereum network id'
toWei(ether)	'convert ether units to wei'
fromWei(wei)	'convert wei units to ether'
deployAllContracts()	'Deploy all the remaining contracts on the current network.'

```

5. We can start off by checking the info of our contract:
```javascript
->contract.info()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "You will find what you need in info1()."

```

We get an indication to invoke `info1()` next.

6. Invoking `info1()`, we get more data from the contract:

```javascript
->contract.info1()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "Try info2(), but with \"hello\" as a parameter."

```
Once again, we get an indication to use `info2()` with `hello` parameter.

7. Now invoking `info2()` with `hello` parameter:

```javascript
->contract.info2('hello')
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "The property infoNum holds the number of the next info method to call."
```

Once again, we get an indication to use `infoNum()` that will give us back a number.

8. Now invoking `infoNum()`:

```javascript
->contract.infoNum()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: i
<snip>
words: Array(2)
    0: 42
    length: 2
<snip>
```

The number we got from the `infoNum()` function is `42`. Which should be appended to the next info we will call.

9. Now calling `info42()`:

```javascript
->contract.info42()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "theMethodName is the name of the next method."
```

Now we know that `theMethodName()` is the next method to call.

10. Calling `theMethodName()`:

```javascript
->contract.theMethodName()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "The method name is method7123949."
```

Once again we will call a new method `method7123949()`.

11. Now calling `method7123949()`:

```javascript
->contract.method7123949()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "If you know the password, submit it to authenticate()."
```

Now we are at the final step where we have to get the password and then use it as an argument for the `athenticate()` method.

12. We can get the password by invoking:

```javascript
->contract.password()
<snip>
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: "ethernaut0"
```

The password is `ethernaut0`.

13. Finally, we can authenticate using the password:

```javascript
->contract.authenticate('ethernaut0')
```
This will prompt us a metamask window to authenticate:

![Authentication](images/4.png)

With that, the challenge is solved by pressing `submit instance` and we are returned the code source of the contract itself!

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Instance {
    string public password;
    uint8 public infoNum = 42;
    string public theMethodName = "The method name is method7123949.";
    bool private cleared = false;

    // constructor
    constructor(string memory _password) {
        password = _password;
    }

    function info() public pure returns (string memory) {
        return "You will find what you need in info1().";
    }

    function info1() public pure returns (string memory) {
        return 'Try info2(), but with "hello" as a parameter.';
    }

    function info2(string memory param) public pure returns (string memory) {
        if (keccak256(abi.encodePacked(param)) == keccak256(abi.encodePacked("hello"))) {
            return "The property infoNum holds the number of the next info method to call.";
        }
        return "Wrong parameter.";
    }

    function info42() public pure returns (string memory) {
        return "theMethodName is the name of the next method.";
    }

    function method7123949() public pure returns (string memory) {
        return "If you know the password, submit it to authenticate().";
    }

    function authenticate(string memory passkey) public {
        if (keccak256(abi.encodePacked(passkey)) == keccak256(abi.encodePacked(password))) {
            cleared = true;
        }
    }

    function getCleared() public view returns (bool) {
        return cleared;
    }
}
```

### Exploitation Steps - Locally compiled contract

Now going an extra step, we will take the provided contract source code, compile it, and exploit it locally. The exploitation steps are the same as explained above.
You can find the full code under `test/HelloEthernautLocal.ts` (hardhat).

Here is the full code:

```javascript
import hre from "hardhat";
const { ethers, networkHelpers } = await hre.network.connect();


describe("Local HelloEthernaut Test", function () {

 it("First challenge solve", async () => {
  const Hello = await ethers.getContractFactory("HelloEthernaut");
  
  const hello = await Hello.deploy('ethernaut0');
  await hello.waitForDeployment();

  const infoOutput = await hello.info();
  console.log("Info() Output: ",infoOutput);

  const info1Output=await hello.info1();
  console.log("Info1() Output: ",info1Output);

  const info2Output=await hello.info2('hello');
  console.log("Info2() Output: ",info2Output);

  const infoNumOutput=Number(await hello.infoNum());
  console.log("InfoNum() Output: ",infoNumOutput);

  const info42Output=await hello.info42();
  console.log("Info42() Output: ",info42Output);

  const theMethodNameOutput=await hello.theMethodName();
  console.log("theMethodName() Output: ",theMethodNameOutput);

  const method7123949Output=await hello.method7123949();
  console.log("method7123949() Output: ",method7123949Output);

  const passwordOutput=await hello.password();
  console.log("password() Output: ",passwordOutput);

  const authenticationOutput=await hello.authenticate('REDACTED');
  console.log("authenticate() Output: ",authenticationOutput);
});
});

```

Output:

```javascript
$ npx hardhat test test/HelloEthernautLocal.ts
No contracts to compile
Running Mocha tests


  Local HelloEthernaut Test
Info() Output:
Info1() Output:  Try info2(), but with "hello" as a parameter.
Info2() Output:  The property infoNum holds the number of the next info method to call.
InfoNum() Output:  42
Info42() Output:  theMethodName is the name of the next method.
theMethodName() Output:  The method name is method7123949.
method7123949() Output:  If you know the password, submit it to authenticate().
password() Output:  ethernaut0
    ✔ First challenge solve (70ms)


  1 passing (73ms)

```

