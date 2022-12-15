import BigNumber from 'bignumber.js'
import { BigNumberish } from 'ethers';

// TIME
// Parse time in ms to human readable string
export function parseTime(seconds: number, appendString?: string) {
	appendString = appendString ? ` ${appendString}`: "";

	if (seconds < 60) return `Less than a minute${appendString}`
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes} minute(s)${appendString}`
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours} hour(s)${appendString}`
	const days = Math.floor(hours / 24)
	return `${days.toLocaleString()} day(s)${appendString}`
}

// CONTRACT ERROR
// Parse contract interaction error into human readable string
export interface TransactionError extends Error {
  reason: string
  code: string
  error: {
    code: number
    message: string
  }
  method: string
  transaction: string
}

export function formatContractError(error: TransactionError | Error) {
  if ('transaction' in error) {
    switch (error.reason) {
      case 'insufficient funds for intrinsic transaction cost':
        return 'Your balance is too low to make this transaction'
      case "execution reverted: Auction doesn't exist":
        return 'Auction no longer exists'
    }

    switch (error?.error?.message) {
      case 'execution reverted: ERC721: owner query for nonexistent token':
        return 'This token was burnt and no longer exists'
      case 'execution reverted: Must send more than last bid by minBidIncrementPercentage amount':
        return 'You need to bid at least 5% more than the last current bid'
      case 'execution reverted: Auction expired':
        return 'The auction has finished, no more bids can be placed'
      case 'execution reverted: Caller must be approved or owner for token id':
        return 'Only the current owner of the token can perform this action'
      case 'execution reverted: Bid invalid for share splitting':
        return 'The value of this bid cannot be correctly split between owners'
      case 'execution reverted: Media: Only approved or owner':
        return 'The contract has not yet been approved or you are the owner'
    }
  }

  switch (error?.message) {
    case 'MetaMask Tx Signature: User denied transaction signature.':
      return 'Transaction rejected. If this was a mistake, try again.'
  }

  return (
    error?.message || 'An unknown error occurred, please try again or contact support.'
  )
}

// CRYPTO AMOUNT
// Parse crypto amounts into human readable formats

const ONE_QUADRILLION = new BigNumber(1000000000000000)
const ONE_TRILLION = new BigNumber(1000000000000)
const ONE_BILLION = new BigNumber(1000000000)
const ONE_MILLION = new BigNumber(1000000)
const ONE_HUNDRED_THOUSAND = new BigNumber(100000)
const TEN_THOUSAND = new BigNumber(10000)
const ONE_THOUSAND = new BigNumber(1000)
const ONE_HUNDRED = new BigNumber(100)
const TEN = new BigNumber(10)
const ONE = new BigNumber(1)
const ONE_MILLIONTH = new BigNumber(0.000001)

function formatCryptoValUnder100K(amount: BigNumber) {
  const formattedVal = amount.isInteger()
    ? amount.toFormat(0)
    : amount.isGreaterThan(TEN_THOUSAND)
			? amount.precision(7).decimalPlaces(2).toFormat()
			: amount.isGreaterThan(ONE_THOUSAND)
				? amount.precision(6).decimalPlaces(2)
				: amount.isGreaterThan(ONE_HUNDRED)
					? amount.precision(6).decimalPlaces(3)
					: amount.isGreaterThan(TEN)
						? amount.precision(6).decimalPlaces(4)
						: amount.isGreaterThan(ONE)
							? amount.precision(6).decimalPlaces(5)
							: amount.isGreaterThanOrEqualTo(ONE_MILLIONTH)
								? amount.precision(6).decimalPlaces(6)
								: `<${ONE_MILLIONTH}` // otherwise we'll get output like '1e-18'
  return formattedVal.toString()
}

function formatCryptoValFrom100Kto1Quadrillion(amount: BigNumber) {
  return amount.isGreaterThan(ONE_TRILLION)
    ? `${amount.dividedBy(ONE_TRILLION).decimalPlaces(2).toString()}T`
    : amount.isGreaterThan(ONE_BILLION)
			? `${amount.dividedBy(ONE_BILLION).decimalPlaces(2).toString()}B`
			: amount.isGreaterThan(ONE_MILLION)
				? `${amount.dividedBy(ONE_MILLION).decimalPlaces(2).toString()}M`
				: `${amount.dividedBy(ONE_THOUSAND).decimalPlaces(2).toString()}k`
}

export function formatCryptoVal(
  cryptoVal: BigNumber | BigNumberish | string,
  baseDecimals = 18
) {
  const raw = typeof cryptoVal === 'string'
		? cryptoVal
		: cryptoVal.toString()
  const parsedamount = new BigNumber(raw)
		.shiftedBy(baseDecimals > 0
			? baseDecimals * -1
			: 0
		)
  return parsedamount.isGreaterThan(ONE_QUADRILLION)
    ? parsedamount.toExponential(2).toString().replace('e+', 'ᴇ')
    : parsedamount.isGreaterThanOrEqualTo(ONE_HUNDRED_THOUSAND)
			? formatCryptoValFrom100Kto1Quadrillion(parsedamount)
			: formatCryptoValUnder100K(parsedamount)
}
