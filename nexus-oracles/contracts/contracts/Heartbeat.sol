// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Heartbeat {

    // events
    event NewHearbeat(
        address indexed account,
        uint256 blockNumber
    );

    mapping(address => uint256) public heartbeats;

    constructor() {
        //
    }

    function heartbeat()
        external
        returns (uint256)
    {
        heartbeats[msg.sender] = block.number;

        emit NewHearbeat(msg.sender, block.number);

        return heartbeats[msg.sender];
    }
}
