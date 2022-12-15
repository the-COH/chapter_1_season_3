// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CycleRelayer.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// this oracle reaches consensus of which on-chain cycle matches the off-chain (drand) cycle
contract RandomnessOracle is Ownable {

    event RandomValueTransmitted(
        address indexed transmitter,
        uint32 indexed cycleId,
        uint256 randomValue
    );

    CycleRelayer public cycleRelayer;

    NodeNetwork public nodeNetwork;

    // {cycleId} => {randomValue}
    mapping(uint32 => uint256) public randomValues;

    // modifiers
    modifier onlyNodes() {
        require(nodeNetwork.nodes(msg.sender), "invalid node");
        _;
    }

    constructor(address cycleRelayerAddress_, address nodeNetwork_) {
        cycleRelayer = CycleRelayer(cycleRelayerAddress_);
        nodeNetwork = NodeNetwork(nodeNetwork_);
    }

    // transmit the random value of the drand cycle
    function transmit(uint32 cycleId_, uint256 randomValue_)
        external
        onlyNodes
    {
        require(cycleId_ == 0 || cycleRelayer.cycles(cycleId_-1) != 0, "prior cycle not fulfilled");
        require(randomValue_ != 0, "invalid rand val");
        require(randomValues[cycleId_] == 0, "random value already transmitted");

        randomValues[cycleId_] = randomValue_;

        emit RandomValueTransmitted(msg.sender, cycleId_, randomValue_);
    }
}
