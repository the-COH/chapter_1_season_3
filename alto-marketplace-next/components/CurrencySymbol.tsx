import { useMemo } from "react"
import Image from "next/image"
import { formatEther, parseEther } from "ethers/lib/utils"
import { formatCryptoVal } from "../utils"

import { defaultCurrency, supportedCurrencyMap } from "../constants"

import { CenteredFlex, FlexProps, Text, TextProps } from "../styles"

type CurrencySymbolProps = TextProps & FlexProps & {
	currency?: string,
	showIcon?: boolean,
	iconSize?: number,
	transformText?: (currencyStr: string) => string
}

export function CurrencySymbol({
	currency = defaultCurrency.id,
	showIcon = true,
	iconSize = 20,
	transformText = (str: string) => str,
	...props
}: CurrencySymbolProps) {
	const { symbol = "???", icon = undefined } = supportedCurrencyMap[ currency.toLowerCase() ] || {}
	
	return (
		<CenteredFlex
			gap={4}
			{...props}>
			{showIcon && icon && (
				<Image
					src={icon}
					width={iconSize}
					height={iconSize}
					alt={symbol.slice(0, 1)}
					style={{ borderRadius: "999px" }}
				/>
			)}
			<Text
				fontSize={10}
				{...props}>
				{transformText(symbol)}
			</Text>
		</CenteredFlex>
	)
}

type AmountWithCurrencyProps = CurrencySymbolProps & {
	amount: string
}

export function AmountWithCurrency({
	amount,
	currency = defaultCurrency.id,
	transformText,
	...props
}: AmountWithCurrencyProps) {
	return (
		<CenteredFlex
			gap={4}
			{...props}>
			<Text {...props}>{formatCryptoVal(amount)}</Text>
			<CurrencySymbol
				currency={currency}
				transformText={transformText}
			/>
		</CenteredFlex>
	)
}

type PercentageOfAmountWithCurrencyProps = TextProps & FlexProps & {
	percentage: number,
	amount: string,
	currency: string
}

export function PercentageOfAmountWithCurrency({ percentage = 0, amount, currency, ...props }: PercentageOfAmountWithCurrencyProps) {
  const percentageAmount = useMemo(() => {
    if (!percentage) return "0"

		try {
      const humanReadableCut = parseFloat(formatEther(amount || 0)) * percentage
			return parseEther(humanReadableCut.toFixed(8)).toString() // for 18 decimal currency, avoid underflows
    } catch(_) {
      return "1"
    }
  }, [ percentage, amount ])

  return (
    <AmountWithCurrency
      amount={percentageAmount}
      currency={currency}
			{...props}
    />
  )
}