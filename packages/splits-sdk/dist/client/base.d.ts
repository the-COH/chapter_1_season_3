import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from '@ethersproject/abstract-signer';
import { Variables } from 'graphql-request';
import type { SplitsClientConfig } from '../types';
declare const MISSING_SIGNER = "";
export default class BaseClient {
    protected readonly _chainId: number;
    protected readonly _ensProvider: Provider | undefined;
    protected readonly _signer: Signer | typeof MISSING_SIGNER;
    private readonly _provider;
    private readonly _graphqlClient;
    protected readonly _includeEnsNames: boolean;
    constructor({ chainId, provider, ensProvider, signer, includeEnsNames, }: SplitsClientConfig);
    protected _makeGqlRequest<ResponseType>(query: string, variables?: Variables): Promise<ResponseType>;
    protected _requireProvider(): void;
    protected _requireSigner(): void;
}
export {};
