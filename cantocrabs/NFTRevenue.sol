pragma solidity ^0.8.0;

import "../contracts/token/ERC721/IERC721.sol";
import "../contracts/utils/math/SafeMath.sol";

contract NFTRevenue {
    using SafeMath for uint256;
    address public NFT_ADDRESS;

    uint256 NFT_SUPPLY;

    IERC721 nft;

    constructor(address NFT_ADDRESS) {
        nft = IERC721(NFT_ADDRESS);

        NFT_SUPPLY = 3333;
    }

    mapping(uint256 => uint256) idToPaidAmount;

    uint256 totalBalance;

    uint256 balancePerNFT;

    function updateNFTPool(uint256 amount) internal {
        totalBalance += amount;
        balancePerNFT = (totalBalance).div(NFT_SUPPLY);
    }

    function getUnclaimedRewards(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return balancePerNFT - idToPaidAmount[tokenId];
    }

    function _claimNFTRewards(uint256 tokenId) internal {
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "Only owner can claim the rewards of this NFT"
        );

        uint256 unpaidRewards = getUnclaimedRewards(tokenId);

        idToPaidAmount[tokenId] += unpaidRewards;

        (bool _sent, bytes memory _data) = msg.sender.call{
            value: unpaidRewards
        }("");

        require(_sent, "Error transferring rewards. Try again!");
    }
}
