import type { SplitRecipient, WaterfallTrancheInput } from '../types';
export declare const validateRecipients: (recipients: SplitRecipient[], maxPrecisionDecimals: number) => void;
export declare const validateDistributorFeePercent: (distributorFeePercent: number) => void;
export declare const validateAddress: (address: string) => void;
export declare const validateTranches: (tranches: WaterfallTrancheInput[]) => void;
