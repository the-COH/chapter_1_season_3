import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractTransaction, Event } from '@ethersproject/contracts';
import type { SplitRecipient, WaterfallTranche, WaterfallTrancheInput } from '../types';
export declare const getRecipientSortedAddressesAndAllocations: (recipients: SplitRecipient[]) => [string[], BigNumber[]];
export declare const getNftCountsFromPercents: (percentAllocations: BigNumber[]) => number[];
export declare const getBigNumberFromPercent: (value: number) => BigNumber;
export declare const fromBigNumberToPercent: (value: BigNumber | number) => number;
export declare const getBigNumberTokenValue: (value: number, decimals: number) => BigNumber;
export declare const getTransactionEvents: (transaction: ContractTransaction, eventTopics: string[]) => Promise<Event[]>;
export declare const fetchERC20TransferredTokens: (splitId: string) => Promise<string[]>;
type TokenBalance = {
    contractAddress: string;
    balance: string;
    symbol: string;
};
export declare const fetchAllTokenBalances: (accountId: string) => Promise<TokenBalance[]>;
export declare const fetchEnsNames: (provider: Provider, addresses: string[]) => Promise<string[]>;
export declare const addEnsNames: (provider: Provider, recipients: SplitRecipient[]) => Promise<void>;
export declare const addWaterfallEnsNames: (provider: Provider, tranches: WaterfallTranche[]) => Promise<void>;
export declare const getTrancheRecipientsAndSizes: (chainId: number, token: string, tranches: WaterfallTrancheInput[], provider: Provider) => Promise<[string[], BigNumber[]]>;
export declare const getTokenData: (chainId: number, token: string, provider: Provider) => Promise<{
    symbol: string;
    decimals: number;
}>;
interface TokenData {
    price: number;
    image: string | null;
    name: string;
    symbol: string;
    decimal: number;
}
export declare const fetchMetaData: (provider: Provider, tokenAddresses: string[]) => Promise<TokenData[]>;
export {};
