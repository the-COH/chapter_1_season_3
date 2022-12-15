import { ContractTransaction, Event } from '@ethersproject/contracts';
import BaseClient from './base';
import type { GqlLiquidSplit } from '../subgraph/types';
import type { LiquidSplit, SplitsClientConfig, CreateLiquidSplitConfig, DistributeLiquidSplitTokenConfig, TransferLiquidSplitOwnershipConfig } from '../types';
export default class LiquidSplitClient extends BaseClient {
    private readonly _liquidSplitFactory;
    readonly eventTopics: {
        [key: string]: string[];
    };
    constructor({ chainId, provider, ensProvider, signer, includeEnsNames, }: SplitsClientConfig);
    submitCreateLiquidSplitTransaction({ recipients, distributorFeePercent, owner, createClone, }: CreateLiquidSplitConfig): Promise<{
        tx: ContractTransaction;
    }>;
    createLiquidSplit({ recipients, distributorFeePercent, owner, createClone, }: CreateLiquidSplitConfig): Promise<{
        liquidSplitId: string;
        event: Event;
    }>;
    submitDistributeTokenTransaction({ liquidSplitId, token, distributorAddress, }: DistributeLiquidSplitTokenConfig): Promise<{
        tx: ContractTransaction;
    }>;
    distributeToken({ liquidSplitId, token, distributorAddress, }: DistributeLiquidSplitTokenConfig): Promise<{
        event: Event;
    }>;
    submitTransferOwnershipTransaction({ liquidSplitId, newOwner, }: TransferLiquidSplitOwnershipConfig): Promise<{
        tx: ContractTransaction;
    }>;
    transferOwnership({ liquidSplitId, newOwner, }: TransferLiquidSplitOwnershipConfig): Promise<{
        event: Event;
    }>;
    getDistributorFee({ liquidSplitId, }: {
        liquidSplitId: string;
    }): Promise<{
        distributorFee: number;
    }>;
    getPayoutSplit({ liquidSplitId }: {
        liquidSplitId: string;
    }): Promise<{
        payoutSplitId: string;
    }>;
    getOwner({ liquidSplitId }: {
        liquidSplitId: string;
    }): Promise<{
        owner: string;
    }>;
    getUri({ liquidSplitId }: {
        liquidSplitId: string;
    }): Promise<{
        uri: string;
    }>;
    getScaledPercentBalanceOf({ liquidSplitId, address, }: {
        liquidSplitId: string;
        address: string;
    }): Promise<{
        scaledPercentBalance: number;
    }>;
    getNftImage({ liquidSplitId }: {
        liquidSplitId: string;
    }): Promise<{
        image: string;
    }>;
    getLiquidSplitMetadata({ liquidSplitId, }: {
        liquidSplitId: string;
    }): Promise<LiquidSplit>;
    private _requireOwner;
    private _getLiquidSplitContract;
    formatLiquidSplit(gqlLiquidSplit: GqlLiquidSplit): Promise<LiquidSplit>;
}
