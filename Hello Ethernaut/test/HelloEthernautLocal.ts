import hre from "hardhat";
const { ethers, networkHelpers } = await hre.network.connect();


describe("Local HelloEthernaut Test", function () {

 it("First challenge solve", async () => {
  const Hello = await ethers.getContractFactory("HelloEthernaut");
  
  const hello = await Hello.deploy('ethernaut0');
  await hello.waitForDeployment();
  const infoOutput = "";
  try {
    const infoOutput = await hello.info();
  } catch {
    const infoOutput = "BAD_DATA ignored";
  }
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

  //const authenticationOutput=await hello.authenticate('REDACTED');
  //console.log("authenticate() Output: ",authenticationOutput);
});


});
