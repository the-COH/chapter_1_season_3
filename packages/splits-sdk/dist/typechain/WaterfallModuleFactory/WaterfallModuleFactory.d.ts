import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../common";
export interface WaterfallModuleFactoryInterface extends utils.Interface {
    functions: {
        "createWaterfallModule(address,address,address[],uint256[])": FunctionFragment;
        "wmImpl()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "createWaterfallModule" | "wmImpl"): FunctionFragment;
    encodeFunctionData(functionFragment: "createWaterfallModule", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[]
    ]): string;
    encodeFunctionData(functionFragment: "wmImpl", values?: undefined): string;
    decodeFunctionResult(functionFragment: "createWaterfallModule", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "wmImpl", data: BytesLike): Result;
    events: {
        "CreateWaterfallModule(address,address,address,address[],uint256[])": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CreateWaterfallModule"): EventFragment;
}
export interface CreateWaterfallModuleEventObject {
    waterfallModule: string;
    token: string;
    nonWaterfallRecipient: string;
    recipients: string[];
    thresholds: BigNumber[];
}
export type CreateWaterfallModuleEvent = TypedEvent<[
    string,
    string,
    string,
    string[],
    BigNumber[]
], CreateWaterfallModuleEventObject>;
export type CreateWaterfallModuleEventFilter = TypedEventFilter<CreateWaterfallModuleEvent>;
export interface WaterfallModuleFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: WaterfallModuleFactoryInterface;
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
        createWaterfallModule(token: PromiseOrValue<string>, nonWaterfallRecipient: PromiseOrValue<string>, recipients: PromiseOrValue<string>[], thresholds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        wmImpl(overrides?: CallOverrides): Promise<[string]>;
    };
    createWaterfallModule(token: PromiseOrValue<string>, nonWaterfallRecipient: PromiseOrValue<string>, recipients: PromiseOrValue<string>[], thresholds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    wmImpl(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        createWaterfallModule(token: PromiseOrValue<string>, nonWaterfallRecipient: PromiseOrValue<string>, recipients: PromiseOrValue<string>[], thresholds: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<string>;
        wmImpl(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "CreateWaterfallModule(address,address,address,address[],uint256[])"(waterfallModule?: PromiseOrValue<string> | null, token?: null, nonWaterfallRecipient?: null, recipients?: null, thresholds?: null): CreateWaterfallModuleEventFilter;
        CreateWaterfallModule(waterfallModule?: PromiseOrValue<string> | null, token?: null, nonWaterfallRecipient?: null, recipients?: null, thresholds?: null): CreateWaterfallModuleEventFilter;
    };
    estimateGas: {
        createWaterfallModule(token: PromiseOrValue<string>, nonWaterfallRecipient: PromiseOrValue<string>, recipients: PromiseOrValue<string>[], thresholds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        wmImpl(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        createWaterfallModule(token: PromiseOrValue<string>, nonWaterfallRecipient: PromiseOrValue<string>, recipients: PromiseOrValue<string>[], thresholds: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        wmImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
