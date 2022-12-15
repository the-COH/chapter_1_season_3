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
exports.fetchMetaData = exports.getTokenData = exports.getTrancheRecipientsAndSizes = exports.addWaterfallEnsNames = exports.addEnsNames = exports.fetchEnsNames = exports.fetchAllTokenBalances = exports.fetchERC20TransferredTokens = exports.getTransactionEvents = exports.getBigNumberTokenValue = exports.fromBigNumberToPercent = exports.getBigNumberFromPercent = exports.getNftCountsFromPercents = exports.getRecipientSortedAddressesAndAllocations = void 0;
var bignumber_1 = require("@ethersproject/bignumber");
var constants_1 = require("@ethersproject/constants");
var contracts_1 = require("@ethersproject/contracts");
var strings_1 = require("@ethersproject/strings");
var units_1 = require("@ethersproject/units");
var constants_2 = require("../constants");
var ierc20_1 = require("./ierc20");
var reverseRecords_1 = require("./reverseRecords");
var getRecipientSortedAddressesAndAllocations = function (recipients) {
    var accounts = [];
    var percentAllocations = [];
    recipients
        .sort(function (a, b) {
        if (a.address.toLowerCase() > b.address.toLowerCase())
            return 1;
        return -1;
    })
        .map(function (value) {
        accounts.push(value.address);
        percentAllocations.push((0, exports.getBigNumberFromPercent)(value.percentAllocation));
    });
    return [accounts, percentAllocations];
};
exports.getRecipientSortedAddressesAndAllocations = getRecipientSortedAddressesAndAllocations;
var getNftCountsFromPercents = function (percentAllocations) {
    return percentAllocations.map(function (p) {
        return p
            .mul(bignumber_1.BigNumber.from(constants_2.LIQUID_SPLIT_NFT_COUNT))
            .div(constants_2.PERCENTAGE_SCALE)
            .toNumber();
    });
};
exports.getNftCountsFromPercents = getNftCountsFromPercents;
var getBigNumberFromPercent = function (value) {
    return bignumber_1.BigNumber.from(Math.round(constants_2.PERCENTAGE_SCALE.toNumber() * value) / 100);
};
exports.getBigNumberFromPercent = getBigNumberFromPercent;
var fromBigNumberToPercent = function (value) {
    var numberVal = value instanceof bignumber_1.BigNumber ? value.toNumber() : value;
    return (numberVal * 100) / constants_2.PERCENTAGE_SCALE.toNumber();
};
exports.fromBigNumberToPercent = fromBigNumberToPercent;
var getBigNumberTokenValue = function (value, decimals) {
    return (0, units_1.parseUnits)(value.toString(), decimals);
};
exports.getBigNumberTokenValue = getBigNumberTokenValue;
var getTransactionEvents = function (transaction, eventTopics) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, events;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, transaction.wait()];
            case 1:
                receipt = _b.sent();
                if (receipt.status === 1) {
                    events = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(function (e) {
                        return eventTopics.includes(e.topics[0]);
                    });
                    return [2 /*return*/, events !== null && events !== void 0 ? events : []];
                }
                return [2 /*return*/, []];
        }
    });
}); };
exports.getTransactionEvents = getTransactionEvents;
var fetchERC20TransferredTokens = function (splitId) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokens = new Set([]);
                return [4 /*yield*/, fetch("https://evm.explorer.canto.io/api?module=account&action=tokenlist&address=".concat(splitId), {
                        method: 'GET',
                        headers: { accept: 'application/json' },
                    })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                data.result.map(function (token) {
                    var erc20Address = token.contractAddress;
                    tokens.add(erc20Address);
                });
                return [2 /*return*/, Array.from(tokens)];
        }
    });
}); };
exports.fetchERC20TransferredTokens = fetchERC20TransferredTokens;
var fetchAllTokenBalances = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, balanceResponse, balance;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://evm.explorer.canto.io/api?module=account&action=tokenlist&address=".concat(accountId), {
                    method: 'GET',
                    headers: { accept: 'application/json' },
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [4 /*yield*/, fetch("https://evm.explorer.canto.io/api?module=account&action=balance&address=".concat(accountId), {
                        method: 'GET',
                        headers: { accept: 'application/json' },
                    })];
            case 3:
                balanceResponse = _a.sent();
                return [4 /*yield*/, balanceResponse.json()];
            case 4:
                balance = _a.sent();
                data.result.push({
                    contractAddress: constants_1.AddressZero,
                    balance: balance.result,
                    symbol: 'CANTO',
                });
                return [2 /*return*/, data.result];
        }
    });
}); };
exports.fetchAllTokenBalances = fetchAllTokenBalances;
var fetchEnsNames = function (provider, addresses) { return __awaiter(void 0, void 0, void 0, function () {
    var providerNetwork, reverseRecords, allNames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.getNetwork()];
            case 1:
                providerNetwork = _a.sent();
                if (providerNetwork.chainId !== 1)
                    return [2 /*return*/, Array(addresses.length).fill(undefined)];
                reverseRecords = new contracts_1.Contract(constants_2.REVERSE_RECORDS_ADDRESS, reverseRecords_1.reverseRecordsInterface, provider);
                return [4 /*yield*/, reverseRecords.getNames(addresses)];
            case 2:
                allNames = _a.sent();
                return [2 /*return*/, allNames];
        }
    });
}); };
exports.fetchEnsNames = fetchEnsNames;
var addEnsNames = function (provider, recipients) { return __awaiter(void 0, void 0, void 0, function () {
    var addresses, allNames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addresses = recipients.map(function (recipient) { return recipient.address; });
                return [4 /*yield*/, (0, exports.fetchEnsNames)(provider, addresses)];
            case 1:
                allNames = _a.sent();
                allNames.map(function (ens, index) {
                    if (ens) {
                        try {
                            if ((0, strings_1.nameprep)(ens)) {
                                recipients[index].ensName = ens;
                            }
                        }
                        catch (e) {
                            // nameprep generates an error for certain characters (like emojis).
                            // Let's just ignore for now and not add the ens
                            return;
                        }
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
exports.addEnsNames = addEnsNames;
var addWaterfallEnsNames = function (provider, tranches) { return __awaiter(void 0, void 0, void 0, function () {
    var addresses, allNames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                addresses = tranches.map(function (tranche) { return tranche.recipientAddress; });
                return [4 /*yield*/, (0, exports.fetchEnsNames)(provider, addresses)];
            case 1:
                allNames = _a.sent();
                allNames.map(function (ens, index) {
                    if (ens) {
                        try {
                            if ((0, strings_1.nameprep)(ens)) {
                                tranches[index].recipientEnsName = ens;
                            }
                        }
                        catch (e) {
                            // nameprep generates an error for certain characters (like emojis).
                            // Let's just ignore for now and not add the ens
                            return;
                        }
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
exports.addWaterfallEnsNames = addWaterfallEnsNames;
var getTrancheRecipientsAndSizes = function (chainId, token, tranches, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var recipients, sizes, tokenData, trancheSum;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                recipients = [];
                sizes = [];
                return [4 /*yield*/, (0, exports.getTokenData)(chainId, token, provider)];
            case 1:
                tokenData = _a.sent();
                trancheSum = bignumber_1.BigNumber.from(0);
                tranches.forEach(function (tranche) {
                    recipients.push(tranche.recipient);
                    if (tranche.size) {
                        trancheSum = trancheSum.add((0, exports.getBigNumberTokenValue)(tranche.size, tokenData.decimals));
                        sizes.push(trancheSum);
                    }
                });
                return [2 /*return*/, [recipients, sizes]];
        }
    });
}); };
exports.getTrancheRecipientsAndSizes = getTrancheRecipientsAndSizes;
var getTokenData = function (chainId, token, provider) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenContract, _a, decimals, symbol;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (token === constants_1.AddressZero) {
                    if (constants_2.POLYGON_CHAIN_IDS.includes(chainId))
                        return [2 /*return*/, {
                                symbol: 'MATIC',
                                decimals: 18,
                            }];
                    if (constants_2.CANTO_CHAIN_IDS.includes(chainId))
                        return [2 /*return*/, {
                                symbol: 'CANTO',
                                decimals: 18,
                            }];
                    return [2 /*return*/, {
                            symbol: 'ETH',
                            decimals: 18,
                        }];
                }
                tokenContract = new contracts_1.Contract(token, ierc20_1.ierc20Interface, provider);
                return [4 /*yield*/, Promise.all([
                        tokenContract.decimals(),
                        tokenContract.symbol(),
                    ])];
            case 1:
                _a = _b.sent(), decimals = _a[0], symbol = _a[1];
                return [2 /*return*/, {
                        symbol: symbol,
                        decimals: decimals,
                    }];
        }
    });
}); };
exports.getTokenData = getTokenData;
var fetchMetaData = function (provider, tokenAddresses) { return __awaiter(void 0, void 0, void 0, function () {
    var prices;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(tokenAddresses.map(function (address) { return __awaiter(void 0, void 0, void 0, function () {
                    var tokenResponse, tokenData, tokenContract, _a, name_1, symbol, decimals;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // handle CANTO as wCANTO
                                if (address === constants_1.AddressZero) {
                                    address = '0x826551890dc65655a0aceca109ab11abdbd7a07b';
                                }
                                return [4 /*yield*/, fetch("https://api.coingecko.com/api/v3/coins/canto/contract/".concat(address.toLowerCase()), {
                                        method: 'GET',
                                        headers: { accept: 'application/json' },
                                    })];
                            case 1:
                                tokenResponse = _b.sent();
                                if (!(tokenResponse.status === 200)) return [3 /*break*/, 3];
                                return [4 /*yield*/, tokenResponse.json()];
                            case 2:
                                tokenData = _b.sent();
                                return [2 /*return*/, {
                                        price: tokenData['market_data']['current_price']['usd'],
                                        image: address === '0x826551890dc65655a0aceca109ab11abdbd7a07b'
                                            ? 'https://raw.githubusercontent.com/Canto-Network/canto-branding-assets/main/avatar-green-on-black.png'
                                            : tokenData['image']['small'],
                                        name: tokenData['name'],
                                        symbol: tokenData['symbol'],
                                        decimal: tokenData['detail_platforms']['canto']['decimal_place'],
                                    }];
                            case 3:
                                tokenContract = new contracts_1.Contract(address, ierc20_1.ierc20Interface, provider);
                                return [4 /*yield*/, Promise.all([
                                        tokenContract.name(),
                                        tokenContract.symbol(),
                                        tokenContract.decimals(),
                                    ])];
                            case 4:
                                _a = _b.sent(), name_1 = _a[0], symbol = _a[1], decimals = _a[2];
                                return [2 /*return*/, {
                                        price: 0,
                                        image: null,
                                        name: name_1,
                                        symbol: symbol,
                                        decimal: decimals,
                                    }];
                        }
                    });
                }); }))];
            case 1:
                prices = _a.sent();
                return [2 /*return*/, prices];
        }
    });
}); };
exports.fetchMetaData = fetchMetaData;
//# sourceMappingURL=index.js.map