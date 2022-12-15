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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitsClient = void 0;
var abi_1 = require("@ethersproject/abi");
var address_1 = require("@ethersproject/address");
var constants_1 = require("@ethersproject/constants");
var contracts_1 = require("@ethersproject/contracts");
var SplitMain_json_1 = __importDefault(require("../artifacts/contracts/SplitMain/ethereum/SplitMain.json"));
var SplitMain_json_2 = __importDefault(require("../artifacts/contracts/SplitMain/polygon/SplitMain.json"));
var base_1 = __importDefault(require("./base"));
var waterfall_1 = __importDefault(require("./waterfall"));
var liquidSplit_1 = __importDefault(require("./liquidSplit"));
var constants_2 = require("../constants");
var errors_1 = require("../errors");
var subgraph_1 = require("../subgraph");
var utils_1 = require("../utils");
var validation_1 = require("../utils/validation");
var splitMainInterfaceEthereum = new abi_1.Interface(SplitMain_json_1.default.abi);
var splitMainInterfacePolygon = new abi_1.Interface(SplitMain_json_2.default.abi);
var SplitsClient = /** @class */ (function (_super) {
    __extends(SplitsClient, _super);
    function SplitsClient(_a) {
        var chainId = _a.chainId, provider = _a.provider, signer = _a.signer, _b = _a.includeEnsNames, includeEnsNames = _b === void 0 ? false : _b, ensProvider = _a.ensProvider;
        var _this = _super.call(this, {
            chainId: chainId,
            provider: provider,
            ensProvider: ensProvider,
            signer: signer,
            includeEnsNames: includeEnsNames,
        }) || this;
        var polygonInterfaceChainIds = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], constants_2.POLYGON_CHAIN_IDS, true), constants_2.OPTIMISM_CHAIN_IDS, true), constants_2.ARBITRUM_CHAIN_IDS, true), constants_2.CANTO_CHAIN_IDS, true);
        var splitMainInterface;
        if (constants_2.ETHEREUM_CHAIN_IDS.includes(chainId))
            splitMainInterface = splitMainInterfaceEthereum;
        else if (polygonInterfaceChainIds.includes(chainId))
            splitMainInterface = splitMainInterfacePolygon;
        else
            throw new errors_1.UnsupportedChainIdError(chainId, constants_2.SPLITS_SUPPORTED_CHAIN_IDS);
        _this._splitMain = new contracts_1.Contract(constants_2.SPLIT_MAIN_ADDRESS, splitMainInterface, provider);
        if (constants_2.WATERFALL_CHAIN_IDS.includes(chainId)) {
            _this.waterfall = new waterfall_1.default({
                chainId: chainId,
                provider: provider,
                ensProvider: ensProvider,
                signer: signer,
                includeEnsNames: includeEnsNames,
            });
        }
        if (constants_2.LIQUID_SPLIT_CHAIN_IDS.includes(chainId)) {
            _this.liquidSplits = new liquidSplit_1.default({
                chainId: chainId,
                provider: provider,
                ensProvider: ensProvider,
                signer: signer,
                includeEnsNames: includeEnsNames,
            });
        }
        _this.eventTopics = {
            createSplit: [splitMainInterface.getEventTopic('CreateSplit')],
            updateSplit: [splitMainInterface.getEventTopic('UpdateSplit')],
            distributeToken: [
                splitMainInterface.getEventTopic('DistributeETH'),
                splitMainInterface.getEventTopic('DistributeERC20'),
            ],
            updateSplitAndDistributeToken: [
                splitMainInterface.getEventTopic('UpdateSplit'),
                splitMainInterface.getEventTopic('DistributeETH'),
                splitMainInterface.getEventTopic('DistributeERC20'),
            ],
            withdrawFunds: [splitMainInterface.getEventTopic('Withdrawal')],
            initiateControlTransfer: [
                splitMainInterface.getEventTopic('InitiateControlTransfer'),
            ],
            cancelControlTransfer: [
                splitMainInterface.getEventTopic('CancelControlTransfer'),
            ],
            acceptControlTransfer: [
                splitMainInterface.getEventTopic('ControlTransfer'),
            ],
            makeSplitImmutable: [splitMainInterface.getEventTopic('ControlTransfer')],
        };
        return _this;
    }
    /*
    /
    / SPLIT ACTIONS
    /
    */
    // Write actions
    SplitsClient.prototype.submitCreateSplitTransaction = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, _b = _a.controller, controller = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, accounts, percentAllocations, distributorFee, createSplitTx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateRecipients)(recipients, constants_2.SPLITS_MAX_PRECISION_DECIMALS);
                        (0, validation_1.validateDistributorFeePercent)(distributorFeePercent);
                        this._requireSigner();
                        _c = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _c[0], percentAllocations = _c[1];
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .createSplit(accounts, percentAllocations, distributorFee, controller)];
                    case 1:
                        createSplitTx = _d.sent();
                        return [2 /*return*/, {
                                tx: createSplitTx,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.createSplit = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, controller = _a.controller;
        return __awaiter(this, void 0, void 0, function () {
            var createSplitTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitCreateSplitTransaction({
                            recipients: recipients,
                            distributorFeePercent: distributorFeePercent,
                            controller: controller,
                        })];
                    case 1:
                        createSplitTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(createSplitTx, this.eventTopics.createSplit)];
                    case 2:
                        events = _b.sent();
                        event = events.length > 0 ? events[0] : undefined;
                        if (event && event.args)
                            return [2 /*return*/, {
                                    splitId: event.args.split,
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.submitUpdateSplitTransaction = function (_a) {
        var splitId = _a.splitId, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, updateSplitTx;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        (0, validation_1.validateRecipients)(recipients, constants_2.SPLITS_MAX_PRECISION_DECIMALS);
                        (0, validation_1.validateDistributorFeePercent)(distributorFeePercent);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _c.sent();
                        _b = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .updateSplit(splitId, accounts, percentAllocations, distributorFee)];
                    case 2:
                        updateSplitTx = _c.sent();
                        return [2 /*return*/, { tx: updateSplitTx }];
                }
            });
        });
    };
    SplitsClient.prototype.updateSplit = function (_a) {
        var splitId = _a.splitId, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent;
        return __awaiter(this, void 0, void 0, function () {
            var updateSplitTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitUpdateSplitTransaction({
                            splitId: splitId,
                            recipients: recipients,
                            distributorFeePercent: distributorFeePercent,
                        })];
                    case 1:
                        updateSplitTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(updateSplitTx, this.eventTopics.updateSplit)];
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
    SplitsClient.prototype.submitDistributeTokenTransaction = function (_a) {
        var splitId = _a.splitId, token = _a.token, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var distributorPayoutAddress, _b, _c, recipients, distributorFeePercent, _d, accounts, percentAllocations, distributorFee, distributeTokenTx;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
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
                        _b = _e.sent();
                        _e.label = 3;
                    case 3:
                        distributorPayoutAddress = _b;
                        (0, validation_1.validateAddress)(distributorPayoutAddress);
                        return [4 /*yield*/, this.getSplitMetadata({
                                splitId: splitId,
                            })];
                    case 4:
                        _c = _e.sent(), recipients = _c.recipients, distributorFeePercent = _c.distributorFeePercent;
                        _d = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _d[0], percentAllocations = _d[1];
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        return [4 /*yield*/, (token === constants_1.AddressZero
                                ? this._splitMain
                                    .connect(this._signer)
                                    .distributeETH(splitId, accounts, percentAllocations, distributorFee, distributorPayoutAddress)
                                : this._splitMain
                                    .connect(this._signer)
                                    .distributeERC20(splitId, token, accounts, percentAllocations, distributorFee, distributorPayoutAddress))];
                    case 5:
                        distributeTokenTx = _e.sent();
                        return [2 /*return*/, { tx: distributeTokenTx }];
                }
            });
        });
    };
    SplitsClient.prototype.distributeToken = function (_a) {
        var splitId = _a.splitId, token = _a.token, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var distributeTokenTx, eventTopic, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitDistributeTokenTransaction({
                            splitId: splitId,
                            token: token,
                            distributorAddress: distributorAddress,
                        })];
                    case 1:
                        distributeTokenTx = (_b.sent()).tx;
                        eventTopic = token === constants_1.AddressZero
                            ? this.eventTopics.distributeToken[0]
                            : this.eventTopics.distributeToken[1];
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
    SplitsClient.prototype.submitUpdateSplitAndDistributeTokenTransaction = function (_a) {
        var splitId = _a.splitId, token = _a.token, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, distributorPayoutAddress, _c, updateAndDistributeTx;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        (0, validation_1.validateAddress)(token);
                        (0, validation_1.validateRecipients)(recipients, constants_2.SPLITS_MAX_PRECISION_DECIMALS);
                        (0, validation_1.validateDistributorFeePercent)(distributorFeePercent);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)
                            // TODO: how to remove this, needed for typescript check right now
                        ];
                    case 1:
                        _d.sent();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        _b = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        if (!distributorAddress) return [3 /*break*/, 2];
                        _c = distributorAddress;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._signer.getAddress()];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4:
                        distributorPayoutAddress = _c;
                        (0, validation_1.validateAddress)(distributorPayoutAddress);
                        return [4 /*yield*/, (token === constants_1.AddressZero
                                ? this._splitMain
                                    .connect(this._signer)
                                    .updateAndDistributeETH(splitId, accounts, percentAllocations, distributorFee, distributorPayoutAddress)
                                : this._splitMain
                                    .connect(this._signer)
                                    .updateAndDistributeERC20(splitId, token, accounts, percentAllocations, distributorFee, distributorPayoutAddress))];
                    case 5:
                        updateAndDistributeTx = _d.sent();
                        return [2 /*return*/, { tx: updateAndDistributeTx }];
                }
            });
        });
    };
    SplitsClient.prototype.updateSplitAndDistributeToken = function (_a) {
        var splitId = _a.splitId, token = _a.token, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var updateAndDistributeTx, eventTopic, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitUpdateSplitAndDistributeTokenTransaction({
                            splitId: splitId,
                            token: token,
                            recipients: recipients,
                            distributorFeePercent: distributorFeePercent,
                            distributorAddress: distributorAddress,
                        })];
                    case 1:
                        updateAndDistributeTx = (_b.sent()).tx;
                        eventTopic = token === constants_1.AddressZero
                            ? this.eventTopics.updateSplitAndDistributeToken[1]
                            : this.eventTopics.updateSplitAndDistributeToken[2];
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(updateAndDistributeTx, [
                                eventTopic,
                            ])];
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
    SplitsClient.prototype.submitWithdrawFundsTransaction = function (_a) {
        var address = _a.address, tokens = _a.tokens;
        return __awaiter(this, void 0, void 0, function () {
            var withdrawEth, erc20s, withdrawTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(address);
                        this._requireSigner();
                        withdrawEth = tokens.includes(constants_1.AddressZero) ? 1 : 0;
                        erc20s = tokens.filter(function (token) { return token !== constants_1.AddressZero; });
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .withdraw(address, withdrawEth, erc20s)];
                    case 1:
                        withdrawTx = _b.sent();
                        return [2 /*return*/, { tx: withdrawTx }];
                }
            });
        });
    };
    SplitsClient.prototype.withdrawFunds = function (_a) {
        var address = _a.address, tokens = _a.tokens;
        return __awaiter(this, void 0, void 0, function () {
            var withdrawTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitWithdrawFundsTransaction({
                            address: address,
                            tokens: tokens,
                        })];
                    case 1:
                        withdrawTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(withdrawTx, this.eventTopics.withdrawFunds)];
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
    SplitsClient.prototype.submitInitiateControlTransferTransaction = function (_a) {
        var splitId = _a.splitId, newController = _a.newController;
        return __awaiter(this, void 0, void 0, function () {
            var transferSplitTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .transferControl(splitId, newController)];
                    case 2:
                        transferSplitTx = _b.sent();
                        return [2 /*return*/, { tx: transferSplitTx }];
                }
            });
        });
    };
    SplitsClient.prototype.initiateControlTransfer = function (_a) {
        var splitId = _a.splitId, newController = _a.newController;
        return __awaiter(this, void 0, void 0, function () {
            var transferSplitTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitInitiateControlTransferTransaction({
                            splitId: splitId,
                            newController: newController,
                        })];
                    case 1:
                        transferSplitTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(transferSplitTx, this.eventTopics.initiateControlTransfer)];
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
    SplitsClient.prototype.submitCancelControlTransferTransaction = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var cancelTransferSplitTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .cancelControlTransfer(splitId)];
                    case 2:
                        cancelTransferSplitTx = _b.sent();
                        return [2 /*return*/, { tx: cancelTransferSplitTx }];
                }
            });
        });
    };
    SplitsClient.prototype.cancelControlTransfer = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var cancelTransferSplitTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitCancelControlTransferTransaction({ splitId: splitId })];
                    case 1:
                        cancelTransferSplitTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(cancelTransferSplitTx, this.eventTopics.cancelControlTransfer)];
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
    SplitsClient.prototype.submitAcceptControlTransferTransaction = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var acceptTransferSplitTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireNewPotentialController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .acceptControl(splitId)];
                    case 2:
                        acceptTransferSplitTx = _b.sent();
                        return [2 /*return*/, { tx: acceptTransferSplitTx }];
                }
            });
        });
    };
    SplitsClient.prototype.acceptControlTransfer = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var acceptTransferSplitTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitAcceptControlTransferTransaction({ splitId: splitId })];
                    case 1:
                        acceptTransferSplitTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(acceptTransferSplitTx, this.eventTopics.acceptControlTransfer)];
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
    SplitsClient.prototype.submitMakeSplitImmutableTransaction = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var makeSplitImmutableTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .makeSplitImmutable(splitId)];
                    case 2:
                        makeSplitImmutableTx = _b.sent();
                        return [2 /*return*/, { tx: makeSplitImmutableTx }];
                }
            });
        });
    };
    SplitsClient.prototype.makeSplitImmutable = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var makeSplitImmutableTx, events, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.submitMakeSplitImmutableTransaction({ splitId: splitId })];
                    case 1:
                        makeSplitImmutableTx = (_b.sent()).tx;
                        return [4 /*yield*/, (0, utils_1.getTransactionEvents)(makeSplitImmutableTx, this.eventTopics.makeSplitImmutable)];
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
    SplitsClient.prototype.getSplitBalance = function (_a) {
        var splitId = _a.splitId, _b = _a.token, token = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var balance, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireProvider();
                        if (!(token === constants_1.AddressZero)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._splitMain.getETHBalance(splitId)];
                    case 1:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._splitMain.getERC20Balance(splitId, token)];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4:
                        balance = _c;
                        return [2 /*return*/, { balance: balance }];
                }
            });
        });
    };
    SplitsClient.prototype.predictImmutableSplitAddress = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, splitId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateRecipients)(recipients, constants_2.SPLITS_MAX_PRECISION_DECIMALS);
                        (0, validation_1.validateDistributorFeePercent)(distributorFeePercent);
                        this._requireProvider();
                        _b = (0, utils_1.getRecipientSortedAddressesAndAllocations)(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = (0, utils_1.getBigNumberFromPercent)(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain.predictImmutableSplitAddress(accounts, percentAllocations, distributorFee)];
                    case 1:
                        splitId = _c.sent();
                        return [2 /*return*/, { splitId: splitId }];
                }
            });
        });
    };
    SplitsClient.prototype.getController = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var controller;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireProvider();
                        return [4 /*yield*/, this._splitMain.getController(splitId)];
                    case 1:
                        controller = _b.sent();
                        return [2 /*return*/, { controller: controller }];
                }
            });
        });
    };
    SplitsClient.prototype.getNewPotentialController = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var newPotentialController;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireProvider();
                        return [4 /*yield*/, this._splitMain.getNewPotentialController(splitId)];
                    case 1:
                        newPotentialController = _b.sent();
                        return [2 /*return*/, { newPotentialController: newPotentialController }];
                }
            });
        });
    };
    SplitsClient.prototype.getHash = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        this._requireProvider();
                        return [4 /*yield*/, this._splitMain.getHash(splitId)];
                    case 1:
                        hash = _b.sent();
                        return [2 /*return*/, { hash: hash }];
                }
            });
        });
    };
    // Graphql read actions
    SplitsClient.prototype.getSplitMetadata = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.SPLIT_QUERY, {
                                splitId: splitId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.split)
                            throw new errors_1.AccountNotFoundError("No split found at address ".concat(splitId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        return [4 /*yield*/, this._formatSplit(response.split)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    SplitsClient.prototype.getTopSplits = function (_a) {
        var lastId = _a.lastId;
        return __awaiter(this, void 0, void 0, function () {
            var response, splits;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._makeGqlRequest(subgraph_1.TOP_SPLITS_QUERY, { lastId: lastId.toLowerCase() })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(response.splits.map(function (gqlSplit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(gqlSplit)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                            ])];
                    case 2:
                        splits = (_b.sent())[0];
                        return [2 /*return*/, {
                                splits: splits,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getTopRecipients = function (_a) {
        var lastId = _a.lastId;
        return __awaiter(this, void 0, void 0, function () {
            var response, recipients;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._makeGqlRequest(subgraph_1.TOP_RECIPIENTS_QUERY, { lastId: lastId.toLowerCase() })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(response.recipients.map(function (gqlRecipient) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatRecipient(gqlRecipient)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                            ])];
                    case 2:
                        recipients = (_b.sent())[0];
                        return [2 /*return*/, {
                                recipients: recipients,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getRelatedSplits = function (_a) {
        var address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var response, _b, receivingFrom, controlling, pendingControl;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        (0, validation_1.validateAddress)(address);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.RELATED_SPLITS_QUERY, { accountId: address.toLowerCase() })];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(response.receivingFrom.map(function (recipient) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(recipient.split)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                                Promise.all(response.controlling.map(function (gqlSplit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(gqlSplit)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                                Promise.all(response.pendingControl.map(function (gqlSplit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(gqlSplit)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                            ])];
                    case 2:
                        _b = _c.sent(), receivingFrom = _b[0], controlling = _b[1], pendingControl = _b[2];
                        return [2 /*return*/, {
                                receivingFrom: receivingFrom,
                                controlling: controlling,
                                pendingControl: pendingControl,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getSplitEarnings = function (_a) {
        var splitId = _a.splitId, _b = _a.includeActiveBalances, includeActiveBalances = _b === void 0 ? true : _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, distributed, internalBalances, internalTokens, erc20Tokens, _c, tokens, activeBalances;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, validation_1.validateAddress)(splitId);
                        if (includeActiveBalances && !this._splitMain.provider)
                            throw new errors_1.MissingProviderError('Provider required to get split active balances. Please update your call to the SplitsClient constructor with a valid provider, or set includeActiveBalances to false');
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.ACCOUNT_BALANCES_QUERY, {
                                accountId: splitId.toLowerCase(),
                            })];
                    case 1:
                        response = _d.sent();
                        if (!response.accountBalances)
                            throw new errors_1.AccountNotFoundError("No split found at address ".concat(splitId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        distributed = (0, subgraph_1.formatAccountBalances)(response.accountBalances.withdrawals);
                        if (!includeActiveBalances)
                            return [2 /*return*/, {
                                    distributed: distributed,
                                }];
                        internalBalances = (0, subgraph_1.formatAccountBalances)(response.accountBalances.internalBalances);
                        internalTokens = Object.keys(internalBalances);
                        if (!this._splitMain.provider) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utils_1.fetchERC20TransferredTokens)(splitId)];
                    case 2:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = [];
                        _d.label = 4;
                    case 4:
                        erc20Tokens = _c;
                        tokens = Array.from(new Set(internalTokens.concat(erc20Tokens).concat([constants_1.AddressZero])));
                        return [4 /*yield*/, Promise.all(tokens.map(function (token) { return _this.getSplitBalance({ splitId: splitId, token: token }); }))];
                    case 5:
                        activeBalances = (_d.sent()).reduce(function (acc, balanceDict, index) {
                            var balance = balanceDict.balance;
                            var token = (0, address_1.getAddress)(tokens[index]);
                            if (balance > constants_1.One)
                                acc[token] = balance;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                activeBalances: activeBalances,
                                distributed: distributed,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getUserEarnings = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var response, withdrawn, activeBalances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(userId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.ACCOUNT_BALANCES_QUERY, {
                                accountId: userId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.accountBalances)
                            throw new errors_1.AccountNotFoundError("No user found at address ".concat(userId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        withdrawn = (0, subgraph_1.formatAccountBalances)(response.accountBalances.withdrawals);
                        activeBalances = (0, subgraph_1.formatAccountBalances)(response.accountBalances.internalBalances);
                        return [2 /*return*/, { withdrawn: withdrawn, activeBalances: activeBalances }];
                }
            });
        });
    };
    /*
    /
    / ACCOUNT ACTIONS
    /
    */
    // Graphql read actions
    SplitsClient.prototype.getAccountMetadata = function (_a) {
        var accountId = _a.accountId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (0, validation_1.validateAddress)(accountId);
                        this._requireProvider();
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.ACCOUNT_QUERY, {
                                accountId: accountId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        if (!response.account)
                            throw new errors_1.AccountNotFoundError("No account found at address ".concat(accountId, ", please confirm you have entered the correct address. There may just be a delay in subgraph indexing."));
                        return [4 /*yield*/, this._formatAccount(response.account)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    // Helper functions
    SplitsClient.prototype._requireController = function (splitId) {
        return __awaiter(this, void 0, void 0, function () {
            var controller, signerAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getController({ splitId: splitId })
                        // TODO: how to get rid of this, needed for typescript check
                    ];
                    case 1:
                        controller = (_a.sent()).controller;
                        // TODO: how to get rid of this, needed for typescript check
                        if (!this._signer)
                            throw new Error();
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        signerAddress = _a.sent();
                        if (controller !== signerAddress)
                            throw new errors_1.InvalidAuthError("Action only available to the split controller. Split id: ".concat(splitId, ", split controller: ").concat(controller, ", signer: ").concat(signerAddress));
                        return [2 /*return*/];
                }
            });
        });
    };
    SplitsClient.prototype._requireNewPotentialController = function (splitId) {
        return __awaiter(this, void 0, void 0, function () {
            var newPotentialController, signerAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNewPotentialController({
                            splitId: splitId,
                        })
                        // TODO: how to get rid of this, needed for typescript check
                    ];
                    case 1:
                        newPotentialController = (_a.sent()).newPotentialController;
                        // TODO: how to get rid of this, needed for typescript check
                        if (!this._signer)
                            throw new Error();
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        signerAddress = _a.sent();
                        if (newPotentialController !== signerAddress)
                            throw new errors_1.InvalidAuthError("Action only available to the split's new potential controller. Split new potential controller: ".concat(newPotentialController, ". Signer: ").concat(signerAddress));
                        return [2 /*return*/];
                }
            });
        });
    };
    SplitsClient.prototype._formatAccount = function (gqlAccount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!gqlAccount)
                            return [2 /*return*/];
                        if (!(gqlAccount.__typename === 'Split')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._formatSplit(gqlAccount)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(gqlAccount.__typename === 'WaterfallModule' && this.waterfall)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.waterfall.formatWaterfallModule(gqlAccount)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!(gqlAccount.__typename === 'LiquidSplit' && this.liquidSplits)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.liquidSplits.formatLiquidSplit(gqlAccount)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SplitsClient.prototype._formatSplit = function (gqlSplit) {
        return __awaiter(this, void 0, void 0, function () {
            var split;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        split = (0, subgraph_1.protectedFormatSplit)(gqlSplit);
                        if (!this._includeEnsNames) return [3 /*break*/, 2];
                        if (!this._ensProvider)
                            throw new Error();
                        return [4 /*yield*/, (0, utils_1.addEnsNames)(this._ensProvider, split.recipients)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, split];
                }
            });
        });
    };
    SplitsClient.prototype._formatRecipient = function (gqlRecipient) {
        return __awaiter(this, void 0, void 0, function () {
            var recipient;
            return __generator(this, function (_a) {
                recipient = (0, subgraph_1.formatRecipient)(gqlRecipient);
                return [2 /*return*/, recipient];
            });
        });
    };
    return SplitsClient;
}(base_1.default));
exports.SplitsClient = SplitsClient;
//# sourceMappingURL=index.js.map