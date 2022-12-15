// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CycleRelayer.sol";
import "./RandomnessOracle.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// this oracle reaches consensus of which on-chain cycle matches the off-chain (drand) cycle
contract RandomnessConsumer {

    using SafeMath for uint256;

    event Commit(
        uint256 indexed commitmentId,
        address indexed committer,
        address indexed commitFor
    );

    CycleRelayer public cycleRelayer;
    RandomnessOracle public randomnessOracle;

    struct Commitment {
        address committer;
        address commitFor;
        uint32 cycleId;
    }

    mapping(uint256 => Commitment) public commitments;

    // committer => cycleId => committedOrNot
    mapping(address => mapping(uint32 => bool)) public cycleCommitters;

    uint256 public nextCommitmentId;

    constructor(
        address cycleRelayerAddress_,
        address randomnessOracleAddress_
    ) {
        cycleRelayer = CycleRelayer(cycleRelayerAddress_);
        randomnessOracle = RandomnessOracle(randomnessOracleAddress_);
    }

    /// @param cycleId_ The cycleId_ param is a parameter used to determine the level of randomness (the bigger cycleId_, the longer until revelation)
    function commit(uint32 cycleId_, address commitFor_)
        external
        returns (uint256 commitmentId)
    {
        require(cycleId_ >= cycleRelayer.nextCycleId() && randomnessOracle.randomValues(cycleId_) == 0, "cannot commit to expired cycle");
        require(cycleCommitters[msg.sender][cycleId_] == false, "already committed to cycle");

        commitmentId = nextCommitmentId;

        commitments[commitmentId] = Commitment({
            committer: msg.sender,
            commitFor: commitFor_,
            cycleId: cycleId_
        });

        nextCommitmentId++;

        emit Commit(commitmentId, msg.sender, commitFor_);
    }

    // to get the random value as a bool (ideal for casinos and GameFi),
    // just run modulo 2 on the random value
    // e.g. getRandomValue(commitmentId) % 2 => 0|1
    function getRandomValue(uint256 commitmentId_)
        public
        view
        returns (uint256 result)
    {
        require(commitments[commitmentId_].committer != address(0), "commitment not found");

        uint256 randomValue = randomnessOracle.randomValues(commitments[commitmentId_].cycleId);

        require(randomValue != 0, "pending random value");

        uint256 pseudoSeed = uint256(keccak256(abi.encodePacked(commitments[commitmentId_].committer, commitments[commitmentId_].commitFor, commitments[commitmentId_].cycleId)));

        result = pseudoSeed > randomValue ? pseudoSeed.mod(randomValue) : randomValue.mod(pseudoSeed);
    }
}
