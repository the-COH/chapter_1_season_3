pragma solidity ^0.8.0;

import "../contracts/utils/math/SafeMath.sol";
import "../contracts/access/Ownable.sol";
import "../contracts/utils/Address.sol";
import "./Auth.sol";
import "../contracts/utils/Counters.sol";
import "./CasinoGame.sol";
import "./Referral.sol";
import "./NFTRevenue.sol";

contract Roulette is Auth, CasinoGame, Referral, NFTRevenue {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    uint256 maxBet;

    uint256 _nftFee = 25;
    uint256 _houseEdge = 25;
    uint256 _referralFee = 50;
    uint256 FEE_DENOM = 1000;

    address private _houseAddress;

    Counters.Counter betsCounter;

    enum GameStatus {
        PENDING,
        WON,
        LOST
    }

    struct Bet {
        uint256 betId;
        uint256 betAmount;
        uint256 betNumber;
        uint256 betType;
        address player;
        GameStatus status;
    }

    mapping(uint256 => Bet) bets;

    mapping(address => uint256) playerToBetId;

    mapping(address => uint256) playerToPlayerId;

    mapping(uint256 => address) playerIdToPlayer;

    uint256 playerCount;

    event BetPlaced(
        uint256 betId,
        address player,
        uint256 amount,
        uint256 betChoice,
        uint256 betType
    );

    event BetResolved(
        address player,
        uint256 betId,
        uint256 number,
        bool outcome,
        uint256 payout
    );

    uint256 _deployDate;

    constructor(address _nftAddress, uint256 _maxBet)
        Auth(msg.sender)
        NFTRevenue(_nftAddress)
    {
        maxBet = _maxBet;
        _deployDate = block.timestamp;
        _houseAddress = msg.sender;
    }

    event Received(address, uint256);

    receive() external payable {}

    function play(
        uint256 choice,
        uint256 betType,
        uint256 referrerId
    )
        public
        payable
        isValidRollNumber(choice)
        isValidBetType(betType)
        nonReentrant
    {
        require(msg.value <= maxBet, "Bet exceeds max betting limit");
        require(
            choice <= PAYOUT[betType],
            "Choice is not compatible with the bet type selected"
        );
        require(
            playerToBetId[msg.sender] == 0,
            "User already has bet placed. Resolve said bet"
        );

        if (
            playerToPlayerId[msg.sender] == 0 &&
            !hasReferrer(msg.sender) &&
            referrerId != 0 &&
            referrerId <= playerCount
        ) {
            address _referrer = playerIdToPlayer[referrerId];
            setupReferent(msg.sender, _referrer);
        }

        uint256 nftAmount = msg.value.mul(_nftFee).div(FEE_DENOM);

        uint256 houseAmount = msg.value.mul(_houseEdge).div(FEE_DENOM);

        uint256 referralAmount = msg.value.mul(_referralFee).div(FEE_DENOM);

        uint256 finalBetAmount = msg.value.sub(nftAmount).sub(houseAmount).sub(
            referralAmount
        );

        betsCounter.increment();

        uint256 currentBetId = betsCounter.current();

        Bet memory betData = Bet(
            currentBetId,
            finalBetAmount,
            choice,
            betType,
            msg.sender,
            GameStatus.PENDING
        );

        playerToBetId[msg.sender] = currentBetId;

        bets[currentBetId] = betData;

        if (playerToPlayerId[msg.sender] == 0) {
            playerCount += 1;
            playerToPlayerId[msg.sender] = playerCount;
            playerIdToPlayer[playerCount] = msg.sender;
        }

        if (hasReferrer(msg.sender)) {
            payRefferal(msg.sender, referralAmount);
        } else {
            payHouse(referralAmount);
        }

        payHouse(houseAmount);

        updateNFTPool(nftAmount);

        emit BetPlaced(currentBetId, msg.sender, msg.value, choice, betType);
    }

    function resolve() public nonReentrant {
        require(
            playerToBetId[msg.sender] != 0,
            "No unresolved bets for this player"
        );
        require(
            bets[playerToBetId[msg.sender]].status == GameStatus.PENDING,
            "This bet is not pending"
        );

        uint256 previousBetId = playerToBetId[msg.sender];

        uint256 hashNumber = random();

        uint256 rolledNumber = (hashNumber % 36) + 1;

        bool gameWon = _rollWheel(
            rolledNumber,
            bets[playerToBetId[msg.sender]].betNumber,
            bets[playerToBetId[msg.sender]].betType
        );

        uint256 payout = 0;

        if (gameWon) {
            payout = _getRollValue(
                bets[playerToBetId[msg.sender]].betAmount,
                bets[playerToBetId[msg.sender]].betType
            );
        }

        playerToBetId[msg.sender] = 0;

        bets[playerToBetId[msg.sender]].status = gameWon
            ? GameStatus.WON
            : GameStatus.LOST;

        (bool payoutSent, ) = msg.sender.call{value: payout}("");

        require(payoutSent, "Unable to send payout");

        emit BetResolved(
            msg.sender,
            previousBetId,
            rolledNumber,
            gameWon,
            payout
        );
    }

    function setMaxBet(uint256 _maxBet) external authorized {
        require(maxBet > 0, "Max bet cannot be 0");
        maxBet = _maxBet;
    }

    function getMaxBet() external view authorized returns (uint256) {
        return maxBet;
    }

    function getPlayerBetId(address _player) external view returns (uint256) {
        return playerToBetId[_player];
    }

    function getPlayerId(address _player) external view returns (uint256) {
        return playerToPlayerId[_player];
    }

    function claimNFTRevenue(uint256 tokenId) external nonReentrant {
        _claimNFTRewards(tokenId);
    }

    function migrateLiquidity() external authorized {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Error transferring");
    }

    function setHouseEdge(uint256 _edge) external authorized {
        require(_edge <= 150, "Edge can never be more than 15%");
        _houseEdge = _edge;
    }

    function setNFTFee(uint256 _newFee) external authorized {
        require(_newFee <= 150, "Fee can never be more than 15%");
        _nftFee = _newFee;
    }

    function setReferralFee(uint256 _newFee) external authorized {
        require(_newFee <= 150, "Fee can never be more than 15%");
        _referralFee = _newFee;
    }

    function payHouse(uint256 amount) internal {
        (bool sent, ) = _houseAddress.call{value: amount}("");
        require(sent, "Error in paying the house");
    }

    function random() internal view returns (uint256) {
        /*
        Internal RNG Generation
        */
    }
}
