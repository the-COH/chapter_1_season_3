import type { Event } from '@ethersproject/contracts';
import { CreateLiquidSplitConfig, LiquidSplit, DistributeLiquidSplitTokenConfig, TransferLiquidSplitOwnershipConfig } from '@neobase-one/splits-sdk';
import { ContractExecutionStatus, RequestError } from '../types';
export declare const useCreateLiquidSplit: () => {
    createLiquidSplit: (arg0: CreateLiquidSplitConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useDistributeLiquidSplitToken: () => {
    distributeToken: (arg0: DistributeLiquidSplitTokenConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useTransferLiquidSplitOwnership: () => {
    transferOwnership: (arg0: TransferLiquidSplitOwnershipConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useLiquidSplitMetadata: (liquidSplitId: string) => {
    isLoading: boolean;
    liquidSplitMetadata: LiquidSplit | undefined;
};
