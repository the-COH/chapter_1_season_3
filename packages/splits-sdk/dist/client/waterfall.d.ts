import BaseClient from './base';
import { BigNumber } from '@ethersproject/bignumber';
import { ContractTransaction, Event } from '@ethersproject/contracts';
import type { GqlWaterfallModule } from '../subgraph/types';
import type { CreateWaterfallConfig, RecoverNonWaterfallFundsConfig, SplitsClientConfig, WaterfallFundsConfig, WaterfallModule, WithdrawWaterfallPullFundsConfig } from '../types';
export default class WaterfallClient extends BaseClient {
    private readonly _waterfallModuleFactory;
    readonly eventTopics: {
        [key: string]: string[];
    };
    constructor({ chainId, provider, ensProvider, signer, includeEnsNames, }: SplitsClientConfig);
    submitCreateWaterfallModuleTransaction({ token, tranches, nonWaterfallRecipient, }: CreateWaterfallConfig): Promise<{
        tx: ContractTransaction;
    }>;
    createWaterfallModule({ token, tranches, nonWaterfallRecipient, }: CreateWaterfallConfig): Promise<{
        waterfallModuleId: string;
        event: Event;
    }>;
    submitWaterfallFundsTransaction({ waterfallModuleId, usePull, }: WaterfallFundsConfig): Promise<{
        tx: ContractTransaction;
    }>;
    waterfallFunds({ waterfallModuleId, usePull, }: WaterfallFundsConfig): Promise<{
        event: Event;
    }>;
    submitRecoverNonWaterfallFundsTransaction({ waterfallModuleId, token, recipient, }: RecoverNonWaterfallFundsConfig): Promise<{
        tx: ContractTransaction;
    }>;
    recoverNonWaterfallFunds({ waterfallModuleId, token, recipient, }: RecoverNonWaterfallFundsConfig): Promise<{
        event: Event;
    }>;
    submitWithdrawPullFundsTransaction({ waterfallModuleId, address, }: WithdrawWaterfallPullFundsConfig): Promise<{
        tx: ContractTransaction;
    }>;
    withdrawPullFunds({ waterfallModuleId, address, }: WithdrawWaterfallPullFundsConfig): Promise<{
        event: Event;
    }>;
    getDistributedFunds({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<{
        distributedFunds: BigNumber;
    }>;
    getFundsPendingWithdrawal({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<{
        fundsPendingWithdrawal: BigNumber;
    }>;
    getTranches({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<{
        recipients: string[];
        thresholds: BigNumber[];
    }>;
    getNonWaterfallRecipient({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<{
        nonWaterfallRecipient: string;
    }>;
    getToken({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<{
        token: string;
    }>;
    getPullBalance({ waterfallModuleId, address, }: {
        waterfallModuleId: string;
        address: string;
    }): Promise<{
        pullBalance: BigNumber;
    }>;
    getWaterfallMetadata({ waterfallModuleId, }: {
        waterfallModuleId: string;
    }): Promise<WaterfallModule>;
    private _validateRecoverTokensWaterfallData;
    private _getWaterfallContract;
    formatWaterfallModule(gqlWaterfallModule: GqlWaterfallModule): Promise<WaterfallModule>;
}
