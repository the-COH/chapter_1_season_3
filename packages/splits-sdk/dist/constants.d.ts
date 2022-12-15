import { BigNumber } from '@ethersproject/bignumber';
export declare const PERCENTAGE_SCALE: BigNumber;
export declare const SPLIT_MAIN_ADDRESS = "0x3c4b7a091647aBBD2F737f33766c9eFD520B1C78";
export declare const WATERFALL_MODULE_FACTORY_ADDRESS = "0x5DF044Ff0Bf4d960aB9A299C07Cf4b7F6B3552df";
export declare const REVERSE_RECORDS_ADDRESS = "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";
export declare const LIQUID_SPLIT_FACTORY_ADDRESS = "0x4BC97bCb77f7Ff9D3540e754E4cBA9EFF5f6cc66";
export declare const ETHEREUM_CHAIN_IDS: number[];
export declare const POLYGON_CHAIN_IDS: number[];
export declare const OPTIMISM_CHAIN_IDS: number[];
export declare const ARBITRUM_CHAIN_IDS: number[];
export declare const CANTO_CHAIN_IDS: number[];
export declare const SPLITS_SUPPORTED_CHAIN_IDS: number[];
export declare const SPLITS_SUBGRAPH_CHAIN_IDS: number[];
export declare const WATERFALL_CHAIN_IDS: number[];
export declare const LIQUID_SPLIT_CHAIN_IDS: number[];
export declare const SPLITS_MAX_PRECISION_DECIMALS = 4;
export declare const LIQUID_SPLITS_MAX_PRECISION_DECIMALS = 1;
export declare const LIQUID_SPLIT_NFT_COUNT = 1000;
export declare const LIQUID_SPLIT_URI_BASE_64_HEADER = "data:application/json;base64,";
export declare const CHAIN_INFO: {
    [chainId: number]: {
        startBlock: number;
    };
};
