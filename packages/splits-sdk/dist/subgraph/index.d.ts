import { GraphQLClient } from 'graphql-request';
import type { LiquidSplit, Split, SplitRecipient, TokenBalances, WaterfallModule } from '../types';
import { GqlLiquidSplit, GqlSplit, GqlTokenBalance, GqlWaterfallModule } from './types';
export declare const formatRecipient: (gqlRecipient: {
    account: {
        id: string;
    };
    ownership: number;
}) => SplitRecipient;
export declare const protectedFormatSplit: (gqlSplit: GqlSplit) => Split;
export declare const protectedFormatWaterfallModule: (gqlWaterfallModule: GqlWaterfallModule, tokenSymbol: string, tokenDecimals: number) => WaterfallModule;
export declare const protectedFormatLiquidSplit: (gqlLiquidSplit: GqlLiquidSplit) => LiquidSplit;
export declare const formatAccountBalances: (gqlTokenBalances: GqlTokenBalance[]) => TokenBalances;
export declare const SPLIT_QUERY: string;
export declare const WATERFALL_MODULE_QUERY: string;
export declare const LIQUID_SPLIT_QUERY: string;
export declare const ACCOUNT_QUERY: string;
export declare const TOP_SPLITS_QUERY: string;
export declare const TOP_RECIPIENTS_QUERY: string;
export declare const RELATED_SPLITS_QUERY: string;
export declare const ACCOUNT_BALANCES_QUERY: string;
export declare const getGraphqlClient: (chainId: number) => GraphQLClient | undefined;
