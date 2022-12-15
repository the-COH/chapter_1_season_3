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
exports.useWaterfallMetadata = exports.useWithdrawWaterfallPullFunds = exports.useRecoverNonWaterfallFunds = exports.useWaterfallFunds = exports.useCreateWaterfallModule = void 0;
var react_1 = require("react");
var splits_sdk_1 = require("@neobase-one/splits-sdk");
var context_1 = require("../context");
var useCreateWaterfallModule = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var createWaterfallModule = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.splitsClient.waterfall)
                        throw new Error('Invalid chain id for waterfall');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.waterfall.submitCreateWaterfallModuleTransaction(argsDict)];
                case 2:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.waterfall.eventTopics.createWaterfallModule)];
                case 3:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 4:
                    e_1 = _a.sent();
                    setStatus('error');
                    setError(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { createWaterfallModule: createWaterfallModule, status: status, txHash: txHash, error: error };
};
exports.useCreateWaterfallModule = useCreateWaterfallModule;
var useWaterfallFunds = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var waterfallFunds = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.splitsClient.waterfall)
                        throw new Error('Invalid chain id for waterfall');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.waterfall.submitWaterfallFundsTransaction(argsDict)];
                case 2:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.waterfall.eventTopics.waterfallFunds)];
                case 3:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 4:
                    e_2 = _a.sent();
                    setStatus('error');
                    setError(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { waterfallFunds: waterfallFunds, status: status, txHash: txHash, error: error };
};
exports.useWaterfallFunds = useWaterfallFunds;
var useRecoverNonWaterfallFunds = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var recoverNonWaterfallFunds = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.splitsClient.waterfall)
                        throw new Error('Invalid chain id for waterfall');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.waterfall.submitRecoverNonWaterfallFundsTransaction(argsDict)];
                case 2:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.waterfall.eventTopics.recoverNonWaterfallFunds)];
                case 3:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 4:
                    e_3 = _a.sent();
                    setStatus('error');
                    setError(e_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { recoverNonWaterfallFunds: recoverNonWaterfallFunds, status: status, txHash: txHash, error: error };
};
exports.useRecoverNonWaterfallFunds = useRecoverNonWaterfallFunds;
var useWithdrawWaterfallPullFunds = function () {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var _a = (0, react_1.useState)(), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)(), txHash = _b[0], setTxHash = _b[1];
    var _c = (0, react_1.useState)(), error = _c[0], setError = _c[1];
    var withdrawPullFunds = (0, react_1.useCallback)(function (argsDict) { return __awaiter(void 0, void 0, void 0, function () {
        var tx, events, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!context.splitsClient.waterfall)
                        throw new Error('Invalid chain id for waterfall');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    setStatus('pendingApproval');
                    setError(undefined);
                    setTxHash(undefined);
                    return [4 /*yield*/, context.splitsClient.waterfall.submitWithdrawPullFundsTransaction(argsDict)];
                case 2:
                    tx = (_a.sent()).tx;
                    setStatus('txInProgress');
                    setTxHash(tx.hash);
                    return [4 /*yield*/, (0, splits_sdk_1.getTransactionEvents)(tx, context.splitsClient.waterfall.eventTopics.withdrawPullFunds)];
                case 3:
                    events = _a.sent();
                    setStatus('complete');
                    return [2 /*return*/, events];
                case 4:
                    e_4 = _a.sent();
                    setStatus('error');
                    setError(e_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [context.splitsClient]);
    return { withdrawPullFunds: withdrawPullFunds, status: status, txHash: txHash, error: error };
};
exports.useWithdrawWaterfallPullFunds = useWithdrawWaterfallPullFunds;
var useWaterfallMetadata = function (waterfallModuleId) {
    var context = (0, react_1.useContext)(context_1.SplitsContext);
    if (context === undefined) {
        throw new Error('Make sure to include <SplitsProvider>');
    }
    var waterfallClient = context.splitsClient.waterfall;
    if (!waterfallClient) {
        throw new Error('Invalid chain id for waterfall');
    }
    var _a = (0, react_1.useState)(), waterfallMetadata = _a[0], setWaterfallMetadata = _a[1];
    var _b = (0, react_1.useState)(!!waterfallModuleId), isLoading = _b[0], setIsLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var isActive = true;
        var fetchMetadata = function () { return __awaiter(void 0, void 0, void 0, function () {
            var waterfall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        return [4 /*yield*/, waterfallClient.getWaterfallMetadata({
                                waterfallModuleId: waterfallModuleId,
                            })];
                    case 1:
                        waterfall = _a.sent();
                        if (!isActive)
                            return [2 /*return*/];
                        setWaterfallMetadata(waterfall);
                        return [3 /*break*/, 3];
                    case 2:
                        if (isActive)
                            setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (waterfallModuleId) {
            setIsLoading(true);
            fetchMetadata();
        }
        else {
            setWaterfallMetadata(undefined);
        }
        return function () {
            isActive = false;
        };
    }, [waterfallClient, waterfallModuleId]);
    return {
        isLoading: isLoading,
        waterfallMetadata: waterfallMetadata,
    };
};
exports.useWaterfallMetadata = useWaterfallMetadata;
//# sourceMappingURL=waterfall.js.map