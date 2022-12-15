"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_INFO = exports.LIQUID_SPLIT_URI_BASE_64_HEADER = exports.LIQUID_SPLIT_NFT_COUNT = exports.LIQUID_SPLITS_MAX_PRECISION_DECIMALS = exports.SPLITS_MAX_PRECISION_DECIMALS = exports.LIQUID_SPLIT_CHAIN_IDS = exports.WATERFALL_CHAIN_IDS = exports.SPLITS_SUBGRAPH_CHAIN_IDS = exports.SPLITS_SUPPORTED_CHAIN_IDS = exports.CANTO_CHAIN_IDS = exports.ARBITRUM_CHAIN_IDS = exports.OPTIMISM_CHAIN_IDS = exports.POLYGON_CHAIN_IDS = exports.ETHEREUM_CHAIN_IDS = exports.LIQUID_SPLIT_FACTORY_ADDRESS = exports.REVERSE_RECORDS_ADDRESS = exports.WATERFALL_MODULE_FACTORY_ADDRESS = exports.SPLIT_MAIN_ADDRESS = exports.PERCENTAGE_SCALE = void 0;
var bignumber_1 = require("@ethersproject/bignumber");
exports.PERCENTAGE_SCALE = bignumber_1.BigNumber.from(1e6);
exports.SPLIT_MAIN_ADDRESS = '0x3c4b7a091647aBBD2F737f33766c9eFD520B1C78';
exports.WATERFALL_MODULE_FACTORY_ADDRESS = '0x5DF044Ff0Bf4d960aB9A299C07Cf4b7F6B3552df';
exports.REVERSE_RECORDS_ADDRESS = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C'; // todo
exports.LIQUID_SPLIT_FACTORY_ADDRESS = '0x4BC97bCb77f7Ff9D3540e754E4cBA9EFF5f6cc66';
exports.ETHEREUM_CHAIN_IDS = [1, 3, 4, 5, 42];
exports.POLYGON_CHAIN_IDS = [137, 80001];
exports.OPTIMISM_CHAIN_IDS = [10, 420];
exports.ARBITRUM_CHAIN_IDS = [42161, 421613];
exports.CANTO_CHAIN_IDS = [7700];
exports.SPLITS_SUPPORTED_CHAIN_IDS = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], exports.ETHEREUM_CHAIN_IDS, true), exports.POLYGON_CHAIN_IDS, true), exports.OPTIMISM_CHAIN_IDS, true), exports.ARBITRUM_CHAIN_IDS, true), exports.CANTO_CHAIN_IDS, true);
exports.SPLITS_SUBGRAPH_CHAIN_IDS = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    1,
    5
], exports.POLYGON_CHAIN_IDS, true), exports.OPTIMISM_CHAIN_IDS, true), exports.ARBITRUM_CHAIN_IDS, true), exports.CANTO_CHAIN_IDS, true);
exports.WATERFALL_CHAIN_IDS = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    1,
    5
], exports.POLYGON_CHAIN_IDS, true), exports.OPTIMISM_CHAIN_IDS, true), exports.ARBITRUM_CHAIN_IDS, true), exports.CANTO_CHAIN_IDS, true);
exports.LIQUID_SPLIT_CHAIN_IDS = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    1,
    5
], exports.POLYGON_CHAIN_IDS, true), exports.OPTIMISM_CHAIN_IDS, true), exports.ARBITRUM_CHAIN_IDS, true), exports.CANTO_CHAIN_IDS, true);
exports.SPLITS_MAX_PRECISION_DECIMALS = 4;
exports.LIQUID_SPLITS_MAX_PRECISION_DECIMALS = 1;
exports.LIQUID_SPLIT_NFT_COUNT = 1000;
exports.LIQUID_SPLIT_URI_BASE_64_HEADER = 'data:application/json;base64,';
exports.CHAIN_INFO = {
    1: {
        startBlock: 14206768,
    },
    3: {
        startBlock: 11962375,
    },
    4: {
        startBlock: 10163325,
    },
    5: {
        startBlock: 6374540,
    },
    42: {
        startBlock: 29821123,
    },
    137: {
        startBlock: 25303316,
    },
    80001: {
        startBlock: 25258326,
    },
    7700: {
        startBlock: 1822239,
    },
    10: {
        startBlock: 24704537,
    },
    420: {
        startBlock: 1324620,
    },
    42161: {
        startBlock: 26082503,
    },
    421613: {
        startBlock: 383218,
    },
};
//# sourceMappingURL=constants.js.map