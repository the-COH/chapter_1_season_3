// SPDX-License-Identifier: MIT

// ========================================== //
//            Butts on Canto 2022             //
// ========================================== //
//                                            // 
//          A most splendid affair.           //
//     http://twitter.com/buttsoncanto        //
//                                            // 
// ========================================== //

pragma solidity ^0.8.16;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ButtRenderer.sol";

contract ButtsOnCanto721 is ERC721AQueryable, Ownable {

  uint256 public priceFor3xPlusHolders;
  uint256 public priceFor2xHolders;
  uint256 public priceFor1xHolders;
  uint256 public basePrice;

  address public paymentRecipient;  
  address public onchainRendererAddress;

  string public baseURI;

  uint256 public constant MAX_SUPPLY = 420;

  // Indicates if a given token has been swapped to live on-chain.
  mapping (uint256 => bool) public onChainTokenIds;

  // Track when a discount has been applied to an address.
  mapping (address => bool) private discountsAppliedToAddresses;

  error WrongValue();
  error BadID();
  error NoAccess();
  error SoldOut();

  constructor(
    uint256 _basePrice,
    uint256 _1xprice,
    uint256 _2xprice,
    uint256 _3xprice,
    string memory _baseURI,
    address _paymentRecipient,
    address _onchainRendererAddress
    ) ERC721A("Butts on Canto", "BUTTSC") {

      priceFor3xPlusHolders = _3xprice;
      priceFor2xHolders = _2xprice;
      priceFor1xHolders = _1xprice;
      basePrice = _basePrice;

      paymentRecipient = _paymentRecipient;
      baseURI = _baseURI;
      onchainRendererAddress = _onchainRendererAddress;
  }  

  // Do you own this butt? You can have it a simple on-chain variation rather than
  // the more delightful traditionally hosted version. 
  function toggleOnChainButtSituation(uint256 tokenId) external {
    if(ownerOf(tokenId) != msg.sender){
      revert NoAccess();

    }
    onChainTokenIds[tokenId] = !onChainTokenIds[tokenId];
  }

  // Is the given token on-chain?
  function getOnChainButtSituation(uint256 tokenId) external view returns (bool) {
    return onChainTokenIds[tokenId];
  }

  // Requires the amount to mint, how many collections you claim to be repreesnted in, and the proof.
  // If it all checks out we can determine how much of a discount to give.
  function mint(uint256 _amount, uint256 collectionPresences, bytes32[] calldata merkleProof) public payable {
    if(_totalMinted() + _amount > MAX_SUPPLY){
      revert SoldOut();
    }

    // TODO: proof....

    (uint256 totalPrice, bool discountApplied) = determinePrice(msg.sender, _amount, collectionPresences, merkleProof);

    discountsAppliedToAddresses[msg.sender] = discountApplied;

    _mint(msg.sender, _amount);
  }

  function determinePrice(address a, uint256 count, uint256 collectionPresences, bytes32[] calldata merkleProof) public returns(uint256, bool) {
    // The contract knows what the story is, let's confirm it matches.
    bool proofIsOk = true;
    bool discountApplied = false;
    uint256 quantityNotDiscounted = count - 1; // First one gets the discount applied.
    uint total;
    if(proofIsOk){
      if(collectionPresences == 3 || collectionPresences == 4){ // Skip >=, for the gas savings.
        total = (quantityNotDiscounted * basePrice) + priceFor3xPlusHolders;
        discountApplied = true;
      } else if (collectionPresences == 2) {
        total = (quantityNotDiscounted * basePrice) + priceFor2xHolders;
        discountApplied = true;
      } else if (collectionPresences == 1) {
        total = (quantityNotDiscounted * basePrice) + priceFor1xHolders;
        discountApplied = true;
      } else {
        total  = count * basePrice;
      }
      return (total, discountApplied);
    }
  }

  // Returns the on-chain metadata plus the appropriate image content, depending on whether the image has been swapped to on-chain mode or not.
  function tokenURI(uint256 tokenId) public view virtual override(ERC721A, IERC721A) returns (string memory) {
    ButtRenderer renderer = ButtRenderer(onchainRendererAddress);
    return renderer.tokenURI(tokenId, onChainTokenIds[tokenId], baseURI);
  }

  function airdrop(uint count, address addr) public onlyOwner {
    _mint(addr, count);
  }

  function wasDiscountApplied(address a) public returns (bool) {
    return discountsAppliedToAddresses[a];
  }

  function setPaymentRecipient(address a) external onlyOwner {
    paymentRecipient = a;
  }

  function setBaseURI(string calldata newURI) external onlyOwner {
    baseURI = newURI;
  }

  function setPrice(uint256 _basePrice, uint256 _1xprice, uint256 _2xprice, uint256 _3xprice) external onlyOwner {
    priceFor3xPlusHolders = _3xprice;
    priceFor2xHolders = _2xprice;
    priceFor1xHolders = _1xprice;
    basePrice = _basePrice;
  }

  // Allow us to upgrade the renderer.
  function setOnchainRendererAddress(address a) external onlyOwner {
    onchainRendererAddress = a;
  }

  receive() external payable {}  

}