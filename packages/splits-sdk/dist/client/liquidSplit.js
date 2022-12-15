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
var abi_1 = require("@ethersproject/abi");
var constants_1 = require("@ethersproject/constants");
var contracts_1 = require("@ethersproject/contracts");
var base_64_1 = require("base-64");
var LiquidSplitFactory_json_1 = __importDefault(require("../artifacts/contracts/LiquidSplitFactory/LiquidSplitFactory.json"));
var LS1155_json_1 = __importDefault(require("../artifacts/contracts/LS1155/LS1155.json"));
var SplitMain_json_1 = __importDefault(require("../artifacts/contracts/SplitMain/polygon/SplitMain.json"));
var base_1 = __importDefault(require("./base"));
var constants_2 = require("../constants");
var errors_1 = require("../errors");
var subgraph_1 = require("../subgraph");
var utils_1 = require("../utils");
var validation_1 = require("../utils/validation");
var liquidSplitFactoryInterface = new abi_1.Interface(LiquidSplitFactory_json_1.default.abi);
var liquidSplitInterface = new abi_1.Interface(LS1155_json_1.default.abi);
var splitMainInterface = new abi_1.Interface(SplitMain_json_1.default.abi);
var LiquidSplitClient = /** @class */ (function (_super) {
    __extends(LiquidSplitClient, _super);
    function LiquidSplitClient(_a) {
        var chainId = _a.chainId, provider = _a.provider, ensProvider = _a.ensProvider, signer = _a.signer, _b = _a.includeEnsNames, includeEnsNames = _b === void 0 ? false : _b;
        var _this = _super.call(this, {
            chainId: chainId,
            provider: provider,
            ensProvider: ensProvider,
            signer: signer,
            includeEnsNames: includeEnsNames,
        }) || this;
        if (constants_2.LIQUID_SPLIT_CHAIN_IDS.includes(chainId)) {
            _this._liquidSplitFactory = new contracts_1.Contract(constants_2.LIQUID_SPLIT_FACTORY_ADDRESS, liquidSplitFactoryInterface, provider);
        }
        else
            throw new errors_1.UnsupportedChainIdError(chainId, constants_2.LIQUID_SPLIT_CHAIN_IDS);
        _this.eventTopics = {
            createLiquidSplit: [
                liquidSplitFactoryInterface.getEventTopic('CreateLS1155Clone'),
                liquidSplitFactoryInterface.getEventTopic('CreateLS1155'),
            ],
            distributeToken: [
                splitMainInterface.getEventTopic('UpdateSplit'),
                splitMainInterface.getEventTopic('DistributeETH'),
                splitMainInterface.getEventTopic('DistributeERC20'),
            ],
            transferOwnership: [
                liquidSplitInterface.getEventTopic('OwnershipTransferred'),
            ],
        };
        return _this;
    }
    // Write actions
    LiquidSplitClient.prototype.submitCreateLiquidSplitTransaction = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, _b = _a.owner, owner = _b === void 0 ? undefined : _b, _c = _a.createClone, createClone = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var ownerAddress, _d, _e, accounts, percentAllocations, nftAmounts, distributorFee, createSplitTx, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        (0, validation_1.validateRecipients)(recipients, constants_2.LIQUID_SPLITS_MAX_PRECISION_DECIMALS);
                        (0, validation_1.validateDistributorFeePercent)(distributorFeePercent);
                        this._requireSigner();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        if (!owner) return [3 /*break*/, 1];
                        _d = owner;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        _d = _g.sent();
                        _g.label = 3;
                    case 3:
                        ownerAddress = _d;
                        (0, validation_1.validateAddress)(ownerAddress);
                        _e = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _e[0], percentAllocations = _e[1];
                        nftAmounts = (0, utils_1.getNftCountsFromPercents)(percentAllocations);
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        if (!createClone) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._liquidSplitFactory
                                .connect(this._signer)
                                .createLiquidSplitClone(accounts, nftAmounts, distributorFee, ownerAddress)];
                    case 4:
                        _f = _g.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._liquidSplitFactory
                            .connect(this._signer)
                            .createLiquidSplit(accounts, nftAmounts, distributorFee, ownerAddress)];
                    case 6:
                        _f = _g.sent();
                        _g.label = 7;
                    case 7:
                        createSplitTx = _f;
                        return [2 /*return*/, { tx: createSplitTx }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.createLiquidSplit = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, owner = _a.owner, _b = _a.createClone, createClone = _b === void 0 ? false : _b;
        return __awaiter(this, void 0, void 0, function () {
            var createSplitTx, eventTopic, events, event;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.submitCreateLiquidSplitTransaction({
                            recipients: recipients,
                            distributorFeePercent: distributorFeePercent,
                            owner: owner,
                            createClone: createClone,
                        })];
                    case 1:
                        createSplitTx = (_c.sent()).tx;
                        eventTopic = createClone
                            ? this.eventTopics.createLiquidSplit[0]
                            : this.eventTopics.createLiquidSplit[1];
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(createSplitTx, [eventTopic])];
                    case 2:
                        events = _c.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event && event.args)
                            return [2 /*return*/, {
                                    liquidSplitId: event.args.ls,
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    LiquidSplitClient.prototype.submitDistributeTokenTransaction = function (_a) {
        var liquidSplitId = _a.liquidSplitId, token = _a.token, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var distributorPayoutAddress, _b, holders, accounts, liquidSplitContract, distributeTokenTx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        (0, validation_1.validateAddress)(token);
                        this._requireSigner();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        if (!distributorAddress) return [3 /*break*/, 1];
                        _b = distributorAddress;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        _b = _c.sent();
                        _c.label = 3;
                    case 3:
                        distributorPayoutAddress = _b;
                        (0, validation_1.validateAddress)(distributorPayoutAddress);
                        return [4 /*yield*/, this.getLiquidSplitMetadata({
                                liquidSplitId: liquidSplitId,
                            })];
                    case 4:
                        holders = (_c.sent()).holders;
                        accounts = holders
                            .map(function (h) { return h.address; })
                            .sort(function (a, b) {
                            if (a.toLowerCase() > b.toLowerCase())
                                return 1;
                            return -1;
                        });
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.distributeFunds(token, accounts, distributorPayoutAddress)];
                    case 5:
                        distributeTokenTx = _c.sent();
                        return [2 /*return*/, { tx: distributeTokenTx }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.distributeToken = function (_a) {
        var liquidSplitId = _a.liquidSplitId, token = _a.token, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var distributeTokenTx, eventTopic, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitDistributeTokenTransaction({
                            liquidSplitId: liquidSplitId,
                            token: token,
                            distributorAddress: distributorAddress,
                        })];
                    case 1:
                        distributeTokenTx = (_b.sent()).tx;
                        eventTopic = token === constants_1.AddressZero
                            ? this.eventTopics.distributeToken[1]
                            : this.eventTopics.distributeToken[2];
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(distributeTokenTx, [eventTopic])];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    LiquidSplitClient.prototype.submitTransferOwnershipTransaction = function (_a) {
        var liquidSplitId = _a.liquidSplitId, newOwner = _a.newOwner;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, transferOwnershipTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        (0, validation_1.validateAddress)(newOwner);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireOwner(liquidSplitId)
                            // TODO: how to remove this, needed for typescript check right now
                        ];
                    case 1:
                        _b.sent();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.transferOwnership(newOwner)];
                    case 2:
                        transferOwnershipTx = _b.sent();
                        return [2 /*return*/, { tx: transferOwnershipTx }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.transferOwnership = function (_a) {
        var liquidSplitId = _a.liquidSplitId, newOwner = _a.newOwner;
        return __awaiter(this, void 0, void 0, function () {
            var transferOwnershipTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitTransferOwnershipTransaction({
                            liquidSplitId: liquidSplitId,
                            newOwner: newOwner,
                        })];
                    case 1:
                        transferOwnershipTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(transferOwnershipTx, this.eventTopics.transferOwnership)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    // Read actions
    LiquidSplitClient.prototype.getDistributorFee = function (_a) {
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, distributorFee;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        this._requireProvider();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.distributorFee()];
                    case 1:
                        distributorFee = _b.sent();
                        return [2 /*return*/, {
                                distributorFee: distributorFee,
                            }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.getPayoutSplit = function (_a) {
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, payoutSplitId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        this._requireProvider();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.payoutSplit()];
                    case 1:
                        payoutSplitId = _b.sent();
                        return [2 /*return*/, {
                                payoutSplitId: payoutSplitId,
                            }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.getOwner = function (_a) {
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, owner;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        this._requireProvider();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.owner()];
                    case 1:
                        owner = _b.sent();
                        return [2 /*return*/, {
                                owner: owner,
                            }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.getUri = function (_a) {
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, uri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        this._requireProvider();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.uri(0)]; // Expects an argument, but it's not actually used
                    case 1:
                        uri = _b.sent() // Expects an argument, but it's not actually used
                        ;
                        return [2 /*return*/, {
                                uri: uri,
                            }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.getScaledPercentBalanceOf = function (_a) {
        var liquidSplitId = _a.liquidSplitId, address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplitContract, scaledPercentBalance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        (0, validation_1.validateAddress)(address);
                        this._requireProvider();
                        liquidSplitContract = this._getLiquidSplitContract(liquidSplitId);
                        return [4 /*yield*/, liquidSplitContract.scaledPercentBalanceOf(address)];
                    case 1:
                        scaledPercentBalance = _b.sent();
                        return [2 /*return*/, {
                                scaledPercentBalance: scaledPercentBalance,
                            }];
                }
            });
        });
    };
    LiquidSplitClient.prototype.getNftImage = function (_a) {
        var _b;
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var uri, decodedUri, uriJson;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        this._requireProvider();
                        return [4 /*yield*/, this.getUri({ liquidSplitId: liquidSplitId })];
                    case 1:
                        uri = (_c.sent()).uri;
                        decodedUri = (0, base_64_1.decode)(uri.slice(constants_2.LIQUID_SPLIT_URI_BASE_64_HEADER.length));
                        uriJson = JSON.parse(decodedUri);
                        return [2 /*return*/, {
                                image: (_b = uriJson.image) !== null && _b !== void 0 ? _b : '',
                            }];
                }
            });
        });
    };
    // Graphql read actions
    LiquidSplitClient.prototype.getLiquidSplitMetadata = function (_a) {
        var liquidSplitId = _a.liquidSplitId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(liquidSplitId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.LIQUID_SPLIT_QUERY, {
                                liquidSplitId: liquidSplitId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.liquidSplit)
                            throw new errors_1.AccountNotFoundError("No liquid split found at address ".concat(liquidSplitId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        return [4 /*yield*/, this.formatLiquidSplit(response.liquidSplit)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // Helper functions
    LiquidSplitClient.prototype._requireOwner = function (liquidSplitId) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, signerAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOwner({ liquidSplitId: liquidSplitId })
                        // TODO: how to get rid of this, needed for typescript check
                    ];
                    case 1:
                        owner = (_a.sent()).owner;
                        // TODO: how to get rid of this, needed for typescript check
                        if (!this._signer)
                            throw new Error();
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        signerAddress = _a.sent();
                        if (owner !== signerAddress)
                            throw new errors_1.InvalidAuthError("Action only available to the liquid split owner. Liquid split id: ".concat(liquidSplitId, ", owner: ").concat(owner, ", signer: ").concat(signerAddress));
                        return [2 /*return*/];
                }
            });
        });
    };
    LiquidSplitClient.prototype._getLiquidSplitContract = function (liquidSplitId) {
        if (!this._liquidSplitFactory.provider && !this._signer)
            throw new Error();
        return new contracts_1.Contract(liquidSplitId, liquidSplitInterface, this._signer || this._liquidSplitFactory.provider);
    };
    LiquidSplitClient.prototype.formatLiquidSplit = function (gqlLiquidSplit) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var liquidSplit;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._requireProvider();
                        if (!this._liquidSplitFactory)
                            throw new Error();
                        liquidSplit = (0, subgraph_1.protectedFormatLiquidSplit)(gqlLiquidSplit);
                        if (!this._includeEnsNames) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, utils_1.addEnsNames)((_a = this._ensProvider) !== null && _a !== void 0 ? _a : this._liquidSplitFactory.provider, liquidSplit.holders)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, liquidSplit];
                }
            });
        });
    };
    return LiquidSplitClient;
}(base_1.default));
exports.default = LiquidSplitClient;
//# sourceMappingURL=liquidSplit.js.map