import type { Event } from '@ethersproject/contracts';
import { CreateWaterfallConfig, RecoverNonWaterfallFundsConfig, WaterfallFundsConfig, WaterfallModule, WithdrawWaterfallPullFundsConfig } from '@neobase-one/splits-sdk';
import { ContractExecutionStatus, RequestError } from '../types';
export declare const useCreateWaterfallModule: () => {
    createWaterfallModule: (arg0: CreateWaterfallConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useWaterfallFunds: () => {
    waterfallFunds: (arg0: WaterfallFundsConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useRecoverNonWaterfallFunds: () => {
    recoverNonWaterfallFunds: (arg0: RecoverNonWaterfallFundsConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useWithdrawWaterfallPullFunds: () => {
    withdrawPullFunds: (arg0: WithdrawWaterfallPullFundsConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useWaterfallMetadata: (waterfallModuleId: string) => {
    isLoading: boolean;
    waterfallMetadata: WaterfallModule | undefined;
};
