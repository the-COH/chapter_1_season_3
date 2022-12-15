import React from 'react';
import { SplitsClient, SplitsClientConfig } from '@neobase-one/splits-sdk';
type SplitsReactSdkContext = {
    splitsClient: SplitsClient;
    initClient: (config: SplitsClientConfig) => void;
};
export declare const SplitsContext: React.Context<SplitsReactSdkContext | undefined>;
interface Props {
    config?: SplitsClientConfig;
    children: React.ReactNode;
}
export declare const SplitsProvider: React.FC<Props>;
export {};
