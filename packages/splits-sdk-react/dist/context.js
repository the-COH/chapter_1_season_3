"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitsProvider = exports.SplitsContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var splits_sdk_1 = require("@neobase-one/splits-sdk");
exports.SplitsContext = (0, react_1.createContext)(undefined);
var SplitsProvider = function (_a) {
    var _b = _a.config, config = _b === void 0 ? { chainId: 1 } : _b, children = _a.children;
    var _c = (0, react_1.useState)(function () { return new splits_sdk_1.SplitsClient(config); }), splitsClient = _c[0], setSplitsClient = _c[1];
    var initClient = function (config) {
        setSplitsClient(new splits_sdk_1.SplitsClient(config));
    };
    var contextValue = (0, react_1.useMemo)(function () { return ({ splitsClient: splitsClient, initClient: initClient }); }, [splitsClient]);
    return ((0, jsx_runtime_1.jsx)(exports.SplitsContext.Provider, __assign({ value: contextValue }, { children: children })));
};
exports.SplitsProvider = SplitsProvider;
//# sourceMappingURL=context.js.map