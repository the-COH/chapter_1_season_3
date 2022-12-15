// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NodeNetwork.sol";

// this oracle reaches consensus of which on-chain cycle matches the off-chain (drand) cycle
contract CycleRelayer is Ownable {

    using SafeMath for uint256;

    // events
    event NewCycle(
        address indexed transmitter,
        uint32 indexed cycleId,
        uint32 indexed drandCycleId
    );

    // {on-chain, incremental cycle ID} => {drand cycle}
    mapping(uint32 => uint32) public cycles;

    // {drand cycle} => {on-chain, incremental cycle ID}
    mapping(uint32 => uint32) public cyclesReverseResolver;

    uint32 public nextCycleId;

    uint256 public latestCycleBlock;

    uint256 public cycleGap;

    NodeNetwork public nodeNetwork;

    // modifiers
    modifier onlyNodes() {
        require(nodeNetwork.nodes(msg.sender), "invalid node");
        _;
    }

    constructor(uint256 cycleGap_, address nodeNetwork_) {
        cycleGap = cycleGap_;
        latestCycleBlock = block.number;
        nodeNetwork = NodeNetwork(nodeNetwork_);
    }

    function transmit(uint32 drandCycleId_)
        external
        onlyOwner
        returns (uint32 currentCycleId)
    {
        require(block.number >= latestCycleBlock.add(cycleGap), "too soon");
        require(drandCycleId_ != 0, "invalid drand cycle");
        require(cycles[nextCycleId] == 0, "cycle already transmitted");
        require(cyclesReverseResolver[drandCycleId_] == 0, "drand cycle already transmitted");
        require(nextCycleId == 0 || drandCycleId_ > cycles[nextCycleId-1], "cannot transmit old drand cycle");

        currentCycleId = nextCycleId;

        cycles[currentCycleId] = drandCycleId_;
        cyclesReverseResolver[drandCycleId_] = currentCycleId;

        // bump next cycle
        nextCycleId++;

        // record latestCycleBlock
        latestCycleBlock = block.number;

        // emit event
        emit NewCycle(msg.sender, currentCycleId, drandCycleId_);
    }

    function nextCycleBlock()
        public
        view
        returns (uint256)
    {
        return latestCycleBlock.add(cycleGap);
    }
}
