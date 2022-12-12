pragma solidity ^0.8.0;
import "../contracts/security/ReentrancyGuard.sol";

contract Referral is ReentrancyGuard {
    mapping(address => address) referentToReferrer;

    uint256 public totalReferralPayout;

    uint256 totalReferents;

    uint256 totalReferrers;

    uint256 totalGameRefferals;

    struct ReferralData {
        address referrerAddress;
        uint256 totalReferrals;
        uint256 totalPayout;
        uint256 paidPayout;
        uint256 unpaidPayout;
    }

    event NewReferrer(address referrer);

    event NewReferral(address referent, address referrer);

    event ReferralFeeEvent(address referent, address referrer, uint256 amount);

    event ReferralClaim(address claimer, uint256 amount);

    mapping(address => ReferralData) referrerData;

    function getReferrerTotalPayout(address _referrer)
        external
        view
        returns (uint256)
    {
        return referrerData[_referrer].totalPayout;
    }

    function getReferrerUnpaidPayout(address _referrer)
        external
        view
        returns (uint256)
    {
        return referrerData[_referrer].unpaidPayout;
    }

    function getReferrerTotalReferrals(address _referrer)
        external
        view
        returns (uint256)
    {
        return referrerData[_referrer].totalReferrals;
    }

    function getReferrer(address _referent) public view returns (address) {
        return referentToReferrer[_referent];
    }

    function claimReferral() public nonReentrant {
        require(referrerExists(msg.sender), "User is not a referrer");
        require(
            referrerData[msg.sender].unpaidPayout > 0,
            "No outstanding rebates to be made"
        );

        uint256 _payout = referrerData[msg.sender].unpaidPayout;

        referrerData[msg.sender].unpaidPayout = 0;
        referrerData[msg.sender].paidPayout += _payout;

        (bool _sent, bytes memory _data) = msg.sender.call{value: _payout}("");

        require(_sent, "Failed to make payment");

        emit ReferralClaim(msg.sender, _payout);
    }

    function hasReferrer(address _referent) internal view returns (bool) {
        bool _hasReferrer = referentToReferrer[_referent] != address(0)
            ? true
            : false;
        return _hasReferrer;
    }

    function isReferrerOfReferent(address _referent, address _referrer)
        internal
        view
        returns (bool)
    {
        return _referrer == getReferrer(_referent);
    }

    function referrerExists(address _referrer) internal view returns (bool) {
        return referrerData[_referrer].referrerAddress != address(0);
    }

    function setupReferrer(address _referrer) internal {
        ReferralData memory referralData = ReferralData(_referrer, 0, 0, 0, 0);
        referrerData[_referrer] = referralData;

        totalReferrers += 1;

        emit NewReferrer(_referrer);
    }

    function setupReferent(address _referent, address _referrer) internal {
        require(!hasReferrer(_referent), "User already has a referrer.");
        if (!referrerExists(_referrer)) {
            setupReferrer(_referrer);
        }
        referentToReferrer[_referent] = _referrer;

        totalReferents += 1;

        emit NewReferral(_referent, _referrer);
    }

    function payRefferal(address _referent, uint256 amount) internal {
        require(
            hasReferrer(_referent),
            "User does not have referrer. Cannot pay referral"
        );
        address _referrer = getReferrer(_referent);
        referrerData[_referrer].totalReferrals += 1;
        referrerData[_referrer].totalPayout += amount;
        referrerData[_referrer].unpaidPayout += amount;

        totalGameRefferals += 1;
        totalReferralPayout += amount;

        emit ReferralFeeEvent(_referent, _referrer, amount);
    }
}
