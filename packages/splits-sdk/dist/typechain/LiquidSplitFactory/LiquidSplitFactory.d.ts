import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface LiquidSplitFactoryInterface extends utils.Interface {
    functions: {
        "MAX_DISTRIBUTOR_FEE()": FunctionFragment;
        "createLiquidSplit(address[],uint32[],uint32,address)": FunctionFragment;
        "createLiquidSplitClone(address[],uint32[],uint32,address)": FunctionFragment;
        "ls1155CloneImpl()": FunctionFragment;
        "splitMain()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "MAX_DISTRIBUTOR_FEE" | "createLiquidSplit" | "createLiquidSplitClone" | "ls1155CloneImpl" | "splitMain"): FunctionFragment;
    encodeFunctionData(functionFragment: "MAX_DISTRIBUTOR_FEE", values?: undefined): string;
    encodeFunctionData(functionFragment: "createLiquidSplit", values: [
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "createLiquidSplitClone", values: [
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "ls1155CloneImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "splitMain", values?: undefined): string;
    decodeFunctionResult(functionFragment: "MAX_DISTRIBUTOR_FEE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createLiquidSplit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createLiquidSplitClone", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ls1155CloneImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "splitMain", data: BytesLike): Result;
    events: {
        "CreateLS1155(address)": EventFragment;
        "CreateLS1155Clone(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CreateLS1155"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "CreateLS1155Clone"): EventFragment;
}
export interface CreateLS1155EventObject {
    ls: string;
}
export type CreateLS1155Event = TypedEvent<[string], CreateLS1155EventObject>;
export type CreateLS1155EventFilter = TypedEventFilter<CreateLS1155Event>;
export interface CreateLS1155CloneEventObject {
    ls: string;
}
export type CreateLS1155CloneEvent = TypedEvent<[
    string
], CreateLS1155CloneEventObject>;
export type CreateLS1155CloneEventFilter = TypedEventFilter<CreateLS1155CloneEvent>;
export interface LiquidSplitFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: LiquidSplitFactoryInterface;
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
        MAX_DISTRIBUTOR_FEE(overrides?: CallOverrides): Promise<[BigNumber]>;
        createLiquidSplit(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        createLiquidSplitClone(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        ls1155CloneImpl(overrides?: CallOverrides): Promise<[string]>;
        splitMain(overrides?: CallOverrides): Promise<[string]>;
    };
    MAX_DISTRIBUTOR_FEE(overrides?: CallOverrides): Promise<BigNumber>;
    createLiquidSplit(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    createLiquidSplitClone(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    ls1155CloneImpl(overrides?: CallOverrides): Promise<string>;
    splitMain(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        MAX_DISTRIBUTOR_FEE(overrides?: CallOverrides): Promise<BigNumber>;
        createLiquidSplit(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        createLiquidSplitClone(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        ls1155CloneImpl(overrides?: CallOverrides): Promise<string>;
        splitMain(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "CreateLS1155(address)"(ls?: PromiseOrValue<string> | null): CreateLS1155EventFilter;
        CreateLS1155(ls?: PromiseOrValue<string> | null): CreateLS1155EventFilter;
        "CreateLS1155Clone(address)"(ls?: PromiseOrValue<string> | null): CreateLS1155CloneEventFilter;
        CreateLS1155Clone(ls?: PromiseOrValue<string> | null): CreateLS1155CloneEventFilter;
    };
    estimateGas: {
        MAX_DISTRIBUTOR_FEE(overrides?: CallOverrides): Promise<BigNumber>;
        createLiquidSplit(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        createLiquidSplitClone(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        ls1155CloneImpl(overrides?: CallOverrides): Promise<BigNumber>;
        splitMain(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        MAX_DISTRIBUTOR_FEE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createLiquidSplit(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        createLiquidSplitClone(accounts: PromiseOrValue<string>[], initAllocations: PromiseOrValue<BigNumberish>[], _distributorFee: PromiseOrValue<BigNumberish>, owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        ls1155CloneImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        splitMain(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
