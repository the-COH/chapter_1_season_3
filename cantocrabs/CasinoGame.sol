pragma solidity ^0.8.0;

contract CasinoGame {
    enum BetType {
        SINGLE,
        ODD,
        EVEN,
        COLUMN,
        ROW,
        COLOR
    }

    mapping(uint256 => uint256) PAYOUT;

    constructor() {
        PAYOUT[uint256(BetType.SINGLE)] = 36;
        PAYOUT[uint256(BetType.ODD)] = 2;
        PAYOUT[uint256(BetType.EVEN)] = 2;
        PAYOUT[uint256(BetType.COLUMN)] = 3;
        PAYOUT[uint256(BetType.ROW)] = 3;
        PAYOUT[uint256(BetType.COLOR)] = 2;
    }

    //HELPER FUNCTIONS

    modifier isValidRollNumber(uint256 x) {
        require(x >= 1, "Number is too small");
        require(x <= 36, "Number is too big");
        _;
    }

    modifier isValidBetType(uint256 x) {
        require(x <= 5, "Invalid Bet Type");
        _;
    }

    function isEven(uint256 x)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        uint256 result = x % 2;
        bool answer = result == 0 ? true : false;
        return answer;
    }

    function isOdd(uint256 x)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        uint256 result = x % 2;
        bool answer = result == 1 ? true : false;
        return answer;
    }

    function isInColumn(uint256 x, uint256 column)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        uint256 upperLimit = column * 12;
        uint256 lowerLimit = ((column - 1) * 12) + 1;

        if (x >= lowerLimit && x <= upperLimit) {
            return true;
        }

        return false;
    }

    function isInRow(uint256 x, uint256 row)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        uint256 result = x % 3;
        if (result == 0 && row == 3) {
            return true;
        }
        if (result == row) {
            return true;
        }
        return false;
    }

    function isRed(uint256 x)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        bool numberEven = isEven(x);
        if (x <= 10) {
            return !numberEven;
        }
        if (x <= 18) {
            return numberEven;
        }
        if (x <= 28) {
            return !numberEven;
        }
        if (x <= 36) {
            return numberEven;
        }
        return false;
    }

    function isBlack(uint256 x)
        internal
        pure
        isValidRollNumber(x)
        returns (bool)
    {
        return !isRed(x);
    }

    function _rollWheel(
        uint256 number,
        uint256 choice,
        uint256 betType
    ) internal isValidRollNumber(number) returns (bool) {
        if (betType == uint256(BetType.SINGLE)) {
            return number == choice;
        }
        if (betType == uint256(BetType.EVEN)) {
            return isEven(number);
        }
        if (betType == uint256(BetType.ODD)) {
            return isOdd(number);
        }
        if (betType == uint256(BetType.COLUMN)) {
            return isInColumn(number, choice);
        }
        if (betType == uint256(BetType.ROW)) {
            return isInRow(number, choice);
        }
        if (betType == uint256(BetType.COLOR)) {
            if (choice == 1) {
                return isRed(number);
            }
            if (choice == 2) {
                return isBlack(number);
            }
        }
        return false;
    }

    function _getRollValue(uint256 amount, uint256 betType)
        internal
        returns (uint256)
    {
        return amount * PAYOUT[betType];
    }
}
