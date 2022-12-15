"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSplitMetadata = exports.useMakeSplitImmutable = exports.useAcceptControlTransfer = exports.useCancelControlTransfer = exports.useInitiateControlTransfer = exports.useWithdrawFunds = exports.useUpdateSplitAndDistributeToken = exports.useDistributeToken = exports.useUpdateSplit = exports.useCreateSplit = exports.useSplitsClient = void 0;
var react_1 = require("react");
var splits_sdk_1 = require("@neobase-one/splits-sdk");
var context_1 = require("../context");
var useSplitsClient = function (config) {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var chainId = config.chainId;
    var provider = config.provider;
    var signer = config.signer;
    var includeEnsNames = config.includeEnsNames;
    var ensProvider = config.ensProvider;
    (0, react_1.useEffect)(function () {
        context.initClient({
            chainId: chainId,
            provider: provider,
            signer: signer,
            includeEnsNames: includeEnsNames,
            ensProvider: ensProvider,
        });
    }, [chainId, provider, signer, includeEnsNames, ensProvider]);
    return context.splitsClient;
};
exports.useSplitsClient = useSplitsClient;
var useCreateSplit = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var createSplit = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitCreateSplitTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.createSplit)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_1 = _a.sent();
                    setStatus('error');
                    setError(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { createSplit: createSplit, status: status, txHash: txHash, error: error };
};
exports.useCreateSplit = useCreateSplit;
var useUpdateSplit = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var updateSplit = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitUpdateSplitTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.updateSplit)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_2 = _a.sent();
                    setStatus('error');
                    setError(e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { updateSplit: updateSplit, status: status, txHash: txHash, error: error };
};
exports.useUpdateSplit = useUpdateSplit;
var useDistributeToken = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var distributeToken = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitDistributeTokenTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.distributeToken)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_3 = _a.sent();
                    setStatus('error');
                    setError(e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { distributeToken: distributeToken, status: status, txHash: txHash, error: error };
};
exports.useDistributeToken = useDistributeToken;
var useUpdateSplitAndDistributeToken = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var updateSplitAndDistributeToken = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitUpdateSplitAndDistributeTokenTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.updateSplitAndDistributeToken)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_4 = _a.sent();
                    setStatus('error');
                    setError(e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { updateSplitAndDistributeToken: updateSplitAndDistributeToken, status: status, txHash: txHash, error: error };
};
exports.useUpdateSplitAndDistributeToken = useUpdateSplitAndDistributeToken;
var useWithdrawFunds = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var withdrawFunds = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitWithdrawFundsTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.withdrawFunds)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_5 = _a.sent();
                    setStatus('error');
                    setError(e_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { withdrawFunds: withdrawFunds, status: status, txHash: txHash, error: error };
};
exports.useWithdrawFunds = useWithdrawFunds;
var useInitiateControlTransfer = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var initiateControlTransfer = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitInitiateControlTransferTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.initiateControlTransfer)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_6 = _a.sent();
                    setStatus('error');
                    setError(e_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { initiateControlTransfer: initiateControlTransfer, status: status, txHash: txHash, error: error };
};
exports.useInitiateControlTransfer = useInitiateControlTransfer;
var useCancelControlTransfer = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var cancelControlTransfer = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitCancelControlTransferTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.cancelControlTransfer)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_7 = _a.sent();
                    setStatus('error');
                    setError(e_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { cancelControlTransfer: cancelControlTransfer, status: status, txHash: txHash, error: error };
};
exports.useCancelControlTransfer = useCancelControlTransfer;
var useAcceptControlTransfer = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var acceptControlTransfer = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitAcceptControlTransferTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.acceptControlTransfer)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_8 = _a.sent();
                    setStatus('error');
                    setError(e_8);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { acceptControlTransfer: acceptControlTransfer, status: status, txHash: txHash, error: error };
};
exports.useAcceptControlTransfer = useAcceptControlTransfer;
var useMakeSplitImmutable = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var makeSplitImmutable = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.submitMakeSplitImmutableTransaction(argsDict)];
                case 1:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.eventTopics.makeSplitImmutable)];
                case 2:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 3:
                    e_9 = _a.sent();
                    setStatus('error');
                    setError(e_9);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { makeSplitImmutable: makeSplitImmutable, status: status, txHash: txHash, error: error };
};
exports.useMakeSplitImmutable = useMakeSplitImmutable;
var useSplitMetadata = function (splitId) {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), splitMetadata = _a[0], setSplitMetadata = _a[1];
    var _b = (0, react_1.useState)(!!splitId), isLoading = _b[0], setIsLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var isActive = true;
        var fetchMetadata = function () { return __awaiter(void 0, void 0, void 0, function () {
            var split;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        return [4 /*yield*/, context.splitsClient.getSplitMetadata({ splitId: splitId })];
                    case 1:
                        split = _a.sent();
                        if (!isActive)
                            return [2 /*return*/];
                        setSplitMetadata(split);
                        return [3 /*break*/, 3];
                    case 2:
                        if (isActive)
                            setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (splitId) {
            setIsLoading(true);
            fetchMetadata();
        }
        else {
            setSplitMetadata(undefined);
        }
        return function () {
            isActive = false;
        };
    }, [context.splitsClient, splitId]);
    return {
        isLoading: isLoading,
        splitMetadata: splitMetadata,
    };
};
exports.useSplitMetadata = useSplitMetadata;
//# sourceMappingURL=splits.js.map