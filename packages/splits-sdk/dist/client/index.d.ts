import { BigNumber } from '@ethersproject/bignumber';
import { ContractTransaction, Event } from '@ethersproject/contracts';
import BaseClient from './base';
import WaterfallClient from './waterfall';
import LiquidSplitClient from './liquidSplit';
import type { SplitsClientConfig, CreateSplitConfig, UpdateSplitConfig, DistributeTokenConfig, WithdrawFundsConfig, InititateControlTransferConfig, CancelControlTransferConfig, AcceptControlTransferConfig, MakeSplitImmutableConfig, GetSplitBalanceConfig, UpdateSplitAndDistributeTokenConfig, SplitRecipient, Split, TokenBalances, Account } from '../types';
export declare class SplitsClient extends BaseClient {
    private readonly _splitMain;
    readonly eventTopics: {
        [key: string]: string[];
    };
    readonly waterfall: WaterfallClient | undefined;
    readonly liquidSplits: LiquidSplitClient | undefined;
    constructor({ chainId, provider, signer, includeEnsNames, ensProvider, }: SplitsClientConfig);
    submitCreateSplitTransaction({ recipients, distributorFeePercent, controller, }: CreateSplitConfig): Promise<{
        tx: ContractTransaction;
    }>;
    createSplit({ recipients, distributorFeePercent, controller, }: CreateSplitConfig): Promise<{
        splitId: string;
        event: Event;
    }>;
    submitUpdateSplitTransaction({ splitId, recipients, distributorFeePercent, }: UpdateSplitConfig): Promise<{
        tx: ContractTransaction;
    }>;
    updateSplit({ splitId, recipients, distributorFeePercent, }: UpdateSplitConfig): Promise<{
        event: Event;
    }>;
    submitDistributeTokenTransaction({ splitId, token, distributorAddress, }: DistributeTokenConfig): Promise<{
        tx: ContractTransaction;
    }>;
    distributeToken({ splitId, token, distributorAddress, }: DistributeTokenConfig): Promise<{
        event: Event;
    }>;
    submitUpdateSplitAndDistributeTokenTransaction({ splitId, token, recipients, distributorFeePercent, distributorAddress, }: UpdateSplitAndDistributeTokenConfig): Promise<{
        tx: ContractTransaction;
    }>;
    updateSplitAndDistributeToken({ splitId, token, recipients, distributorFeePercent, distributorAddress, }: UpdateSplitAndDistributeTokenConfig): Promise<{
        event: Event;
    }>;
    submitWithdrawFundsTransaction({ address, tokens, }: WithdrawFundsConfig): Promise<{
        tx: ContractTransaction;
    }>;
    withdrawFunds({ address, tokens }: WithdrawFundsConfig): Promise<{
        event: Event;
    }>;
    submitInitiateControlTransferTransaction({ splitId, newController, }: InititateControlTransferConfig): Promise<{
        tx: ContractTransaction;
    }>;
    initiateControlTransfer({ splitId, newController, }: InititateControlTransferConfig): Promise<{
        event: Event;
    }>;
    submitCancelControlTransferTransaction({ splitId, }: CancelControlTransferConfig): Promise<{
        tx: ContractTransaction;
    }>;
    cancelControlTransfer({ splitId, }: CancelControlTransferConfig): Promise<{
        event: Event;
    }>;
    submitAcceptControlTransferTransaction({ splitId, }: AcceptControlTransferConfig): Promise<{
        tx: ContractTransaction;
    }>;
    acceptControlTransfer({ splitId, }: AcceptControlTransferConfig): Promise<{
        event: Event;
    }>;
    submitMakeSplitImmutableTransaction({ splitId, }: MakeSplitImmutableConfig): Promise<{
        tx: ContractTransaction;
    }>;
    makeSplitImmutable({ splitId }: MakeSplitImmutableConfig): Promise<{
        event: Event;
    }>;
    getSplitBalance({ splitId, token, }: GetSplitBalanceConfig): Promise<{
        balance: BigNumber;
    }>;
    predictImmutableSplitAddress({ recipients, distributorFeePercent, }: {
        recipients: SplitRecipient[];
        distributorFeePercent: number;
    }): Promise<{
        splitId: string;
    }>;
    getController({ splitId }: {
        splitId: string;
    }): Promise<{
        controller: string;
    }>;
    getNewPotentialController({ splitId }: {
        splitId: string;
    }): Promise<{
        newPotentialController: string;
    }>;
    getHash({ splitId }: {
        splitId: string;
    }): Promise<{
        hash: string;
    }>;
    getSplitMetadata({ splitId }: {
        splitId: string;
    }): Promise<Split>;
    getTopSplits({ lastId }: {
        lastId: string;
    }): Promise<{
        splits: Split[];
    }>;
    getTopRecipients({ lastId }: {
        lastId: string;
    }): Promise<{
        recipients: SplitRecipient[];
    }>;
    getRelatedSplits({ address }: {
        address: string;
    }): Promise<{
        receivingFrom: Split[];
        controlling: Split[];
        pendingControl: Split[];
    }>;
    getSplitEarnings({ splitId, includeActiveBalances, }: {
        splitId: string;
        includeActiveBalances?: boolean;
    }): Promise<{
        activeBalances?: TokenBalances;
        distributed: TokenBalances;
    }>;
    getUserEarnings({ userId }: {
        userId: string;
    }): Promise<{
        withdrawn: TokenBalances;
        activeBalances: TokenBalances;
    }>;
    getAccountMetadata({ accountId, }: {
        accountId: string;
    }): Promise<Account | undefined>;
    private _requireController;
    private _requireNewPotentialController;
    private _formatAccount;
    private _formatSplit;
    private _formatRecipient;
}
