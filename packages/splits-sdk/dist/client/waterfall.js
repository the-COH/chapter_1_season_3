"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("./base"));
var abi_1 = require("@ethersproject/abi");
var constants_1 = require("@ethersproject/constants");
var contracts_1 = require("@ethersproject/contracts");
var WaterfallModuleFactory_json_1 = __importDefault(require("../artifacts/contracts/WaterfallModuleFactory/WaterfallModuleFactory.json"));
var WaterfallModule_json_1 = __importDefault(require("../artifacts/contracts/WaterfallModule/WaterfallModule.json"));
var constants_2 = require("../constants");
var errors_1 = require("../errors");
var subgraph_1 = require("../subgraph");
var utils_1 = require("../utils");
var validation_1 = require("../utils/validation");
var waterfallModuleFactoryInterface = new abi_1.Interface(WaterfallModuleFactory_json_1.default.abi);
var waterfallModuleInterface = new abi_1.Interface(WaterfallModule_json_1.default.abi);
var WaterfallClient = /** @class */ (function (_super) {
    __extends(WaterfallClient, _super);
    function WaterfallClient(_a) {
        var chainId = _a.chainId, provider = _a.provider, ensProvider = _a.ensProvider, signer = _a.signer, _b = _a.includeEnsNames, includeEnsNames = _b === void 0 ? false : _b;
        var _this = _super.call(this, {
            chainId: chainId,
            provider: provider,
            ensProvider: ensProvider,
            signer: signer,
            includeEnsNames: includeEnsNames,
        }) || this;
        if (constants_2.WATERFALL_CHAIN_IDS.includes(chainId)) {
            _this._waterfallModuleFactory = new contracts_1.Contract(constants_2.WATERFALL_MODULE_FACTORY_ADDRESS, waterfallModuleFactoryInterface, provider);
        }
        else
            throw new errors_1.UnsupportedChainIdError(chainId, constants_2.WATERFALL_CHAIN_IDS);
        _this.eventTopics = {
            createWaterfallModule: [
                waterfallModuleFactoryInterface.getEventTopic('CreateWaterfallModule'),
            ],
            waterfallFunds: [
                waterfallModuleInterface.getEventTopic('WaterfallFunds'),
            ],
            recoverNonWaterfallFunds: [
                waterfallModuleInterface.getEventTopic('RecoverNonWaterfallFunds'),
            ],
            withdrawPullFunds: [waterfallModuleInterface.getEventTopic('Withdrawal')],
        };
        return _this;
    }
    // Write actions
    WaterfallClient.prototype.submitCreateWaterfallModuleTransaction = function (_a) {
        var token = _a.token, tranches = _a.tranches, _b = _a.nonWaterfallRecipient, nonWaterfallRecipient = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, recipients, trancheSizes, createWaterfallTx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateAddress)(token);
                        (0, validation_1.validateAddress)(nonWaterfallRecipient);
                        (0, validation_1.validateTranches)(tranches);
                        this._requireSigner();
                        if (!this._waterfallModuleFactory)
                            throw new Error();
                        return [4 /*yield*/, (0, utils_1.getTrancheRecipientsAndSizes)(this._chainId, token, tranches, this._waterfallModuleFactory.provider)];
                    case 1:
                        _c = _d.sent(), recipients = _c[0], trancheSizes = _c[1];
                        return [4 /*yield*/, this._waterfallModuleFactory
                                .connect(this._signer)
                                .createWaterfallModule(token, nonWaterfallRecipient, recipients, trancheSizes)];
                    case 2:
                        createWaterfallTx = _d.sent();
                        return [2 /*return*/, { tx: createWaterfallTx }];
                }
            });
        });
    };
    WaterfallClient.prototype.createWaterfallModule = function (_a) {
        var token = _a.token, tranches = _a.tranches, nonWaterfallRecipient = _a.nonWaterfallRecipient;
        return __awaiter(this, void 0, void 0, function () {
            var createWaterfallTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitCreateWaterfallModuleTransaction({
                            token: token,
                            tranches: tranches,
                            nonWaterfallRecipient: nonWaterfallRecipient,
                        })];
                    case 1:
                        createWaterfallTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(createWaterfallTx, this.eventTopics.createWaterfallModule)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event && event.args)
                            return [2 /*return*/, {
                                    waterfallModuleId: event.args.waterfallModule,
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    WaterfallClient.prototype.submitWaterfallFundsTransaction = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, _b = _a.usePull, usePull = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, waterfallFundsTx, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireSigner();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        if (!usePull) return [3 /*break*/, 2];
                        return [4 /*yield*/, waterfallContract.waterfallFundsPull()];
                    case 1:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, waterfallContract.waterfallFunds()];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4:
                        waterfallFundsTx = _c;
                        return [2 /*return*/, { tx: waterfallFundsTx }];
                }
            });
        });
    };
    WaterfallClient.prototype.waterfallFunds = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, usePull = _a.usePull;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallFundsTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitWaterfallFundsTransaction({ waterfallModuleId: waterfallModuleId, usePull: usePull })];
                    case 1:
                        waterfallFundsTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(waterfallFundsTx, this.eventTopics.waterfallFunds)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event)
                            return [2 /*return*/, {
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    WaterfallClient.prototype.submitRecoverNonWaterfallFundsTransaction = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, token = _a.token, _b = _a.recipient, recipient = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, recoverFundsTx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        (0, validation_1.validateAddress)(token);
                        (0, validation_1.validateAddress)(recipient);
                        this._requireSigner();
                        return [4 /*yield*/, this._validateRecoverTokensWaterfallData({
                                waterfallModuleId: waterfallModuleId,
                                token: token,
                                recipient: recipient,
                            })];
                    case 1:
                        _c.sent();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.recoverNonWaterfallFunds(token, recipient)];
                    case 2:
                        recoverFundsTx = _c.sent();
                        return [2 /*return*/, { tx: recoverFundsTx }];
                }
            });
        });
    };
    WaterfallClient.prototype.recoverNonWaterfallFunds = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, token = _a.token, recipient = _a.recipient;
        return __awaiter(this, void 0, void 0, function () {
            var recoverFundsTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitRecoverNonWaterfallFundsTransaction({
                            waterfallModuleId: waterfallModuleId,
                            token: token,
                            recipient: recipient,
                        })];
                    case 1:
                        recoverFundsTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(recoverFundsTx, this.eventTopics.recoverNonWaterfallFunds)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event)
                            return [2 /*return*/, {
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    WaterfallClient.prototype.submitWithdrawPullFundsTransaction = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, withdrawTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        (0, validation_1.validateAddress)(address);
                        this._requireSigner();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.withdraw(address)];
                    case 1:
                        withdrawTx = _b.sent();
                        return [2 /*return*/, { tx: withdrawTx }];
                }
            });
        });
    };
    WaterfallClient.prototype.withdrawPullFunds = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var withdrawTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitWithdrawPullFundsTransaction({
                            waterfallModuleId: waterfallModuleId,
                            address: address,
                        })];
                    case 1:
                        withdrawTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(withdrawTx, this.eventTopics.withdrawPullFunds)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event)
                            return [2 /*return*/, {
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    // Read actions
    WaterfallClient.prototype.getDistributedFunds = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, distributedFunds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.distributedFunds()];
                    case 1:
                        distributedFunds = _b.sent();
                        return [2 /*return*/, {
                                distributedFunds: distributedFunds,
                            }];
                }
            });
        });
    };
    WaterfallClient.prototype.getFundsPendingWithdrawal = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, fundsPendingWithdrawal;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.fundsPendingWithdrawal()];
                    case 1:
                        fundsPendingWithdrawal = _b.sent();
                        return [2 /*return*/, {
                                fundsPendingWithdrawal: fundsPendingWithdrawal,
                            }];
                }
            });
        });
    };
    WaterfallClient.prototype.getTranches = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, _b, recipients, thresholds;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.getTranches()];
                    case 1:
                        _b = _c.sent(), recipients = _b[0], thresholds = _b[1];
                        return [2 /*return*/, {
                                recipients: recipients,
                                thresholds: thresholds,
                            }];
                }
            });
        });
    };
    WaterfallClient.prototype.getNonWaterfallRecipient = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, nonWaterfallRecipient;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.nonWaterfallRecipient()];
                    case 1:
                        nonWaterfallRecipient = _b.sent();
                        return [2 /*return*/, {
                                nonWaterfallRecipient: nonWaterfallRecipient,
                            }];
                }
            });
        });
    };
    WaterfallClient.prototype.getToken = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.token()];
                    case 1:
                        token = _b.sent();
                        return [2 /*return*/, {
                                token: token,
                            }];
                }
            });
        });
    };
    WaterfallClient.prototype.getPullBalance = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallContract, pullBalance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        this._requireProvider();
                        waterfallContract = this._getWaterfallContract(waterfallModuleId);
                        return [4 /*yield*/, waterfallContract.getPullBalance(address)];
                    case 1:
                        pullBalance = _b.sent();
                        return [2 /*return*/, {
                                pullBalance: pullBalance,
                            }];
                }
            });
        });
    };
    // Graphql read actions
    WaterfallClient.prototype.getWaterfallMetadata = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(waterfallModuleId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.WATERFALL_MODULE_QUERY, {
                                waterfallModuleId: waterfallModuleId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.waterfallModule)
                            throw new errors_1.AccountNotFoundError("No waterfall module found at address ".concat(waterfallModuleId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        return [4 /*yield*/, this.formatWaterfallModule(response.waterfallModule)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // Helper functions
    WaterfallClient.prototype._validateRecoverTokensWaterfallData = function (_a) {
        var waterfallModuleId = _a.waterfallModuleId, token = _a.token, recipient = _a.recipient;
        return __awaiter(this, void 0, void 0, function () {
            var waterfallMetadata, foundRecipient;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getWaterfallMetadata({
                            waterfallModuleId: waterfallModuleId,
                        })];
                    case 1:
                        waterfallMetadata = _b.sent();
                        if (token.toLowerCase() === waterfallMetadata.token.address.toLowerCase())
                            throw new errors_1.InvalidArgumentError("You must call recover tokens with a token other than the given waterfall's primary token. Primary token: ".concat(waterfallMetadata.token.address, ", given token: ").concat(token));
                        if (waterfallMetadata.nonWaterfallRecipient &&
                            waterfallMetadata.nonWaterfallRecipient !== constants_1.AddressZero) {
                            if (recipient.toLowerCase() !==
                                waterfallMetadata.nonWaterfallRecipient.toLowerCase())
                                throw new errors_1.InvalidArgumentError("The passed in recipient (".concat(recipient, ") must match the non waterfall recipient for this module: ").concat(waterfallMetadata.nonWaterfallRecipient));
                        }
                        else {
                            foundRecipient = waterfallMetadata.tranches.reduce(function (acc, tranche) {
                                if (acc)
                                    return acc;
                                return (tranche.recipientAddress.toLowerCase() === recipient.toLowerCase());
                            }, false);
                            if (!foundRecipient)
                                throw new errors_1.InvalidArgumentError("You must pass in a valid recipient address for the given waterfall. Address ".concat(recipient, " not found in any tranche for waterfall ").concat(waterfallModuleId, "."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WaterfallClient.prototype._getWaterfallContract = function (waterfallModule) {
        if (!this._waterfallModuleFactory.provider && !this._signer)
            throw new Error();
        return new contracts_1.Contract(waterfallModule, waterfallModuleInterface, this._signer || this._waterfallModuleFactory.provider);
    };
    WaterfallClient.prototype.formatWaterfallModule = function (gqlWaterfallModule) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var tokenData, waterfallModule;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._requireProvider();
                        if (!this._waterfallModuleFactory)
                            throw new Error();
                        return [4 /*yield*/, (0, utils_1.getTokenData)(this._chainId, gqlWaterfallModule.token.id, this._waterfallModuleFactory.provider)];
                    case 1:
                        tokenData = _b.sent();
                        waterfallModule = (0, subgraph_1.protectedFormatWaterfallModule)(gqlWaterfallModule, tokenData.symbol, tokenData.decimals);
                        if (!this._includeEnsNames) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utils_1.addWaterfallEnsNames)((_a = this._ensProvider) !== null && _a !== void 0 ? _a : this._waterfallModuleFactory.provider, waterfallModule.tranches)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, waterfallModule];
                }
            });
        });
    };
    return WaterfallClient;
}(base_1.default));
exports.default = WaterfallClient;
//# sourceMappingURL=waterfall.js.map