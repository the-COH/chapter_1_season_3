// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract NodeNetwork is Ownable {

    // events
    event NodeAdded(
        address indexed node,
        address indexed addedBy
    );

    event NodeRemoved(
        address indexed node,
        address indexed removedBy
    );

    mapping(address => bool) public nodes;

    constructor() {
        //
    }

    function addNode(address node_)
        public
        onlyOwner
    {
        nodes[node_] = true;

        emit NodeAdded(node_, msg.sender);
    }

    function removeNode(address node_)
        public
    {
        require(msg.sender == owner() || msg.sender == node_, "must be node or owner");

        nodes[node_] = false;

        emit NodeRemoved(node_, msg.sender);
    }
}
