import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface WaterfallModuleInterface extends utils.Interface {
    functions: {
        "distributedFunds()": FunctionFragment;
        "fundsPendingWithdrawal()": FunctionFragment;
        "getPullBalance(address)": FunctionFragment;
        "getTranches()": FunctionFragment;
        "nonWaterfallRecipient()": FunctionFragment;
        "recoverNonWaterfallFunds(address,address)": FunctionFragment;
        "token()": FunctionFragment;
        "waterfallFunds()": FunctionFragment;
        "waterfallFundsPull()": FunctionFragment;
        "withdraw(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "distributedFunds" | "fundsPendingWithdrawal" | "getPullBalance" | "getTranches" | "nonWaterfallRecipient" | "recoverNonWaterfallFunds" | "token" | "waterfallFunds" | "waterfallFundsPull" | "withdraw"): FunctionFragment;
    encodeFunctionData(functionFragment: "distributedFunds", values?: undefined): string;
    encodeFunctionData(functionFragment: "fundsPendingWithdrawal", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPullBalance", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getTranches", values?: undefined): string;
    encodeFunctionData(functionFragment: "nonWaterfallRecipient", values?: undefined): string;
    encodeFunctionData(functionFragment: "recoverNonWaterfallFunds", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "token", values?: undefined): string;
    encodeFunctionData(functionFragment: "waterfallFunds", values?: undefined): string;
    encodeFunctionData(functionFragment: "waterfallFundsPull", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "distributedFunds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fundsPendingWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPullBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTranches", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "nonWaterfallRecipient", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "recoverNonWaterfallFunds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "waterfallFunds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "waterfallFundsPull", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    events: {
        "ReceiveETH(uint256)": EventFragment;
        "RecoverNonWaterfallFunds(address,address,uint256)": EventFragment;
        "WaterfallFunds(address[],uint256[],uint256)": EventFragment;
        "Withdrawal(address,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ReceiveETH"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RecoverNonWaterfallFunds"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "WaterfallFunds"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Withdrawal"): EventFragment;
}
export interface ReceiveETHEventObject {
    amount: BigNumber;
}
export type ReceiveETHEvent = TypedEvent<[BigNumber], ReceiveETHEventObject>;
export type ReceiveETHEventFilter = TypedEventFilter<ReceiveETHEvent>;
export interface RecoverNonWaterfallFundsEventObject {
    nonWaterfallToken: string;
    recipient: string;
    amount: BigNumber;
}
export type RecoverNonWaterfallFundsEvent = TypedEvent<[
    string,
    string,
    BigNumber
], RecoverNonWaterfallFundsEventObject>;
export type RecoverNonWaterfallFundsEventFilter = TypedEventFilter<RecoverNonWaterfallFundsEvent>;
export interface WaterfallFundsEventObject {
    recipients: string[];
    payouts: BigNumber[];
    pullFlowFlag: BigNumber;
}
export type WaterfallFundsEvent = TypedEvent<[
    string[],
    BigNumber[],
    BigNumber
], WaterfallFundsEventObject>;
export type WaterfallFundsEventFilter = TypedEventFilter<WaterfallFundsEvent>;
export interface WithdrawalEventObject {
    account: string;
    amount: BigNumber;
}
export type WithdrawalEvent = TypedEvent<[
    string,
    BigNumber
], WithdrawalEventObject>;
export type WithdrawalEventFilter = TypedEventFilter<WithdrawalEvent>;
export interface WaterfallModule extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: WaterfallModuleInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        distributedFunds(overrides?: CallOverrides): Promise<[BigNumber]>;
        fundsPendingWithdrawal(overrides?: CallOverrides): Promise<[BigNumber]>;
        getPullBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getTranches(overrides?: CallOverrides): Promise<[
            string[],
            BigNumber[]
        ] & {
            recipients: string[];
            thresholds: BigNumber[];
        }>;
        nonWaterfallRecipient(overrides?: CallOverrides): Promise<[string]>;
        recoverNonWaterfallFunds(nonWaterfallToken: PromiseOrValue<string>, recipient: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        token(overrides?: CallOverrides): Promise<[string]>;
        waterfallFunds(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        waterfallFundsPull(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(account: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    distributedFunds(overrides?: CallOverrides): Promise<BigNumber>;
    fundsPendingWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;
    getPullBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getTranches(overrides?: CallOverrides): Promise<[
        string[],
        BigNumber[]
    ] & {
        recipients: string[];
        thresholds: BigNumber[];
    }>;
    nonWaterfallRecipient(overrides?: CallOverrides): Promise<string>;
    recoverNonWaterfallFunds(nonWaterfallToken: PromiseOrValue<string>, recipient: PromiseOrValue<string>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    token(overrides?: CallOverrides): Promise<string>;
    waterfallFunds(overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    waterfallFundsPull(overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(account: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        distributedFunds(overrides?: CallOverrides): Promise<BigNumber>;
        fundsPendingWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;
        getPullBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTranches(overrides?: CallOverrides): Promise<[
            string[],
            BigNumber[]
        ] & {
            recipients: string[];
            thresholds: BigNumber[];
        }>;
        nonWaterfallRecipient(overrides?: CallOverrides): Promise<string>;
        recoverNonWaterfallFunds(nonWaterfallToken: PromiseOrValue<string>, recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        token(overrides?: CallOverrides): Promise<string>;
        waterfallFunds(overrides?: CallOverrides): Promise<void>;
        waterfallFundsPull(overrides?: CallOverrides): Promise<void>;
        withdraw(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "ReceiveETH(uint256)"(amount?: null): ReceiveETHEventFilter;
        ReceiveETH(amount?: null): ReceiveETHEventFilter;
        "RecoverNonWaterfallFunds(address,address,uint256)"(nonWaterfallToken?: null, recipient?: null, amount?: null): RecoverNonWaterfallFundsEventFilter;
        RecoverNonWaterfallFunds(nonWaterfallToken?: null, recipient?: null, amount?: null): RecoverNonWaterfallFundsEventFilter;
        "WaterfallFunds(address[],uint256[],uint256)"(recipients?: null, payouts?: null, pullFlowFlag?: null): WaterfallFundsEventFilter;
        WaterfallFunds(recipients?: null, payouts?: null, pullFlowFlag?: null): WaterfallFundsEventFilter;
        "Withdrawal(address,uint256)"(account?: null, amount?: null): WithdrawalEventFilter;
        Withdrawal(account?: null, amount?: null): WithdrawalEventFilter;
    };
    estimateGas: {
        distributedFunds(overrides?: CallOverrides): Promise<BigNumber>;
        fundsPendingWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;
        getPullBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTranches(overrides?: CallOverrides): Promise<BigNumber>;
        nonWaterfallRecipient(overrides?: CallOverrides): Promise<BigNumber>;
        recoverNonWaterfallFunds(nonWaterfallToken: PromiseOrValue<string>, recipient: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        token(overrides?: CallOverrides): Promise<BigNumber>;
        waterfallFunds(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        waterfallFundsPull(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(account: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        distributedFunds(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        fundsPendingWithdrawal(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPullBalance(account: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTranches(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        nonWaterfallRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        recoverNonWaterfallFunds(nonWaterfallToken: PromiseOrValue<string>, recipient: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        waterfallFunds(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        waterfallFundsPull(overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(account: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
