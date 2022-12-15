// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Deploy contracts
  // NodeNetwork
  const NodeNetwork = await ethers.getContractFactory("NodeNetwork");
  const nodeNetwork = await NodeNetwork.deploy();

  await nodeNetwork.deployed();

  // add nodes
  await nodeNetwork.addNode("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  await nodeNetwork.addNode("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

  // CycleRelayer
  const CycleRelayer = await ethers.getContractFactory("CycleRelayer");
  const cycleRelayer = await CycleRelayer.deploy(10, nodeNetwork.address);

  await cycleRelayer.deployed();

  // RandomnessOracle
  const RandomnessOracle = await ethers.getContractFactory("RandomnessOracle");
  const randomnessOracle = await RandomnessOracle.deploy(
    cycleRelayer.address,
    nodeNetwork.address
  );

  await randomnessOracle.deployed();

  // RandomnessConsumer
  const RandomnessConsumer = await ethers.getContractFactory(
    "RandomnessConsumer"
  );
  const randomnessConsumer = await RandomnessConsumer.deploy(
    randomnessOracle.address,
    cycleRelayer.address
  );

  await randomnessConsumer.deployed();

  console.log("CycleRelayer deployed to:", cycleRelayer.address);
  console.log("RandomnessOracle deployed to:", randomnessOracle.address);
  console.log("RandomnessConsumer deployed to:", randomnessConsumer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
