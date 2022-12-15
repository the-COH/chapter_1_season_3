import type { Event } from '@ethersproject/contracts';
import { SplitsClient, SplitsClientConfig, Split, CreateSplitConfig, UpdateSplitConfig, DistributeTokenConfig, UpdateSplitAndDistributeTokenConfig, WithdrawFundsConfig, InititateControlTransferConfig, CancelControlTransferConfig, AcceptControlTransferConfig, MakeSplitImmutableConfig } from '@neobase-one/splits-sdk';
import { ContractExecutionStatus, RequestError } from '../types';
export declare const useSplitsClient: (config: SplitsClientConfig) => SplitsClient;
export declare const useCreateSplit: () => {
    createSplit: (arg0: CreateSplitConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useUpdateSplit: () => {
    updateSplit: (arg0: UpdateSplitConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useDistributeToken: () => {
    distributeToken: (arg0: DistributeTokenConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useUpdateSplitAndDistributeToken: () => {
    updateSplitAndDistributeToken: (arg0: UpdateSplitAndDistributeTokenConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useWithdrawFunds: () => {
    withdrawFunds: (arg0: WithdrawFundsConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useInitiateControlTransfer: () => {
    initiateControlTransfer: (arg0: InititateControlTransferConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useCancelControlTransfer: () => {
    cancelControlTransfer: (arg0: CancelControlTransferConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useAcceptControlTransfer: () => {
    acceptControlTransfer: (arg0: AcceptControlTransferConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useMakeSplitImmutable: () => {
    makeSplitImmutable: (arg0: MakeSplitImmutableConfig) => Promise<Event[] | undefined>;
    status?: ContractExecutionStatus | undefined;
    txHash?: string | undefined;
    error?: RequestError;
};
export declare const useSplitMetadata: (splitId: string) => {
    isLoading: boolean;
    splitMetadata: Split | undefined;
};
