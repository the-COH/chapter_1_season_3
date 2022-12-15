// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NodeStaking {

    using SafeMath for uint256;
    using SafeERC20 for ERC20;

    // events
    event Deposit(
        address indexed account,
        uint256 amount
    );

    event Withdraw(
        address indexed account,
        uint256 amount
    );

    // properties
    ERC20 public stakingToken;

    mapping(address => uint256) public stakes;

    uint256 public minStake;

    constructor(
        address stakingTokenAddress_,
        uint256 minStake_
    ) {
        stakingToken = ERC20(stakingTokenAddress_);
        minStake = minStake_;
    }

    function deposit(uint256 amount_)
        external
    {
        require(stakingToken.transferFrom(msg.sender, address(this), amount_));

        stakes[msg.sender] += amount_;

        emit Deposit(msg.sender, amount_);
    }

    function withdraw(uint256 amount_)
        external
    {
        require(stakes[msg.sender] >= amount_, "insufficient funds");

        stakes[msg.sender] -= amount_;

        emit Withdraw(msg.sender, amount_);
    }

    function nodes(address account_)
        public
        view
        returns (bool)
    {
        return stakes[account_] >= minStake;
    }
}
