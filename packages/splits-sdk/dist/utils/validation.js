"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTranches = exports.validateAddress = exports.validateDistributorFeePercent = exports.validateRecipients = void 0;
var address_1 = require("@ethersproject/address");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var getNumDigitsAfterDecimal = function (value) {
    if (Number.isInteger(value))
        return 0;
    var decimalStr = value.toString().split('.')[1];
    return decimalStr.length;
};
var validateRecipients = function (recipients, maxPrecisionDecimals) {
    var seenAddresses = new Set([]);
    var totalPercentAllocation = 0;
    if (recipients.length < 2)
        throw new errors_1.InvalidRecipientsError('At least two recipients are required');
    recipients.forEach(function (recipient) {
        if (!(0, address_1.isAddress)(recipient.address))
            throw new errors_1.InvalidRecipientsError("Invalid address: ".concat(recipient.address));
        if (seenAddresses.has(recipient.address.toLowerCase()))
            throw new errors_1.InvalidRecipientsError("Address cannot be used for multiple recipients: ".concat(recipient.address));
        if (recipient.percentAllocation <= 0 || recipient.percentAllocation >= 100)
            throw new errors_1.InvalidRecipientsError("Invalid percent allocation: ".concat(recipient.percentAllocation, ". Must be between 0 and 100"));
        if (getNumDigitsAfterDecimal(recipient.percentAllocation) >
            maxPrecisionDecimals)
            throw new errors_1.InvalidRecipientsError("Invalid precision on percent allocation: ".concat(recipient.percentAllocation, ". Maxiumum allowed precision is ").concat(maxPrecisionDecimals, " decimals"));
        seenAddresses.add(recipient.address.toLowerCase());
        totalPercentAllocation += recipient.percentAllocation;
    });
    // Cutoff any decimals beyond the max precision, they may get introduced due
    // to javascript floating point precision
    var factorOfTen = Math.pow(10, maxPrecisionDecimals);
    totalPercentAllocation =
        Math.round(totalPercentAllocation * factorOfTen) / factorOfTen;
    if (totalPercentAllocation !== 100)
        throw new errors_1.InvalidRecipientsError("Percent allocation must add up to 100. Currently adds up to ".concat(totalPercentAllocation));
};
exports.validateRecipients = validateRecipients;
var validateDistributorFeePercent = function (distributorFeePercent) {
    if (distributorFeePercent < 0 || distributorFeePercent > 10)
        throw new errors_1.InvalidDistributorFeePercentError("Invalid distributor fee percent: ".concat(distributorFeePercent, ". Distributor fee percent must be >= 0 and <= 10"));
    if (getNumDigitsAfterDecimal(distributorFeePercent) >
        constants_1.SPLITS_MAX_PRECISION_DECIMALS)
        throw new errors_1.InvalidDistributorFeePercentError("Invalid precision on distributor fee: ".concat(distributorFeePercent, ". Maxiumum allowed precision is ").concat(constants_1.SPLITS_MAX_PRECISION_DECIMALS, " decimals"));
};
exports.validateDistributorFeePercent = validateDistributorFeePercent;
var validateAddress = function (address) {
    if (!(0, address_1.isAddress)(address))
        throw new errors_1.InvalidArgumentError("Invalid address: ".concat(address));
};
exports.validateAddress = validateAddress;
var validateTranches = function (tranches) {
    tranches.forEach(function (tranche, index) {
        if (!(0, address_1.isAddress)(tranche.recipient))
            throw new errors_1.InvalidArgumentError("Invalid recipient address: ".concat(tranche.recipient));
        if (index === tranches.length - 1) {
            if (tranche.size !== undefined)
                throw new errors_1.InvalidArgumentError('Residual tranche cannot have a size. Please leave as undefined.');
        }
        else {
            if (!tranche.size)
                throw new errors_1.InvalidArgumentError('Size required for all tranches except the residual');
        }
    });
};
exports.validateTranches = validateTranches;
//# sourceMappingURL=validation.js.map