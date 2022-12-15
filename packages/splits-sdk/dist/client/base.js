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
var errors_1 = require("../errors");
var subgraph_1 = require("../subgraph");
var MISSING_SIGNER = '';
var BaseClient = /** @class */ (function () {
    function BaseClient(_a) {
        var chainId = _a.chainId, provider = _a.provider, ensProvider = _a.ensProvider, signer = _a.signer, _b = _a.includeEnsNames, includeEnsNames = _b === void 0 ? false : _b;
        if (includeEnsNames && !provider && !ensProvider)
            throw new errors_1.InvalidConfigError('Must include a mainnet provider if includeEnsNames is set to true');
        this._ensProvider = ensProvider !== null && ensProvider !== void 0 ? ensProvider : provider;
        this._provider = provider;
        this._chainId = chainId;
        this._signer = signer !== null && signer !== void 0 ? signer : MISSING_SIGNER;
        this._graphqlClient = (0, subgraph_1.getGraphqlClient)(chainId);
        this._includeEnsNames = includeEnsNames;
    }
    BaseClient.prototype._makeGqlRequest = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._graphqlClient) {
                            throw new errors_1.UnsupportedSubgraphChainIdError();
                        }
                        return [4 /*yield*/, this._graphqlClient.request(query, variables)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BaseClient.prototype._requireProvider = function () {
        if (!this._provider)
            throw new errors_1.MissingProviderError('Provider required to perform this action, please update your call to the constructor');
    };
    BaseClient.prototype._requireSigner = function () {
        this._requireProvider();
        if (!this._signer)
            throw new errors_1.MissingSignerError('Signer required to perform this action, please update your call to the constructor');
    };
    return BaseClient;
}());
exports.default = BaseClient;
//# sourceMappingURL=base.js.map