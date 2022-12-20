import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from "react"
import styled from "styled-components"
import { formatEther, parseEther, parseUnits } from "ethers/lib/utils"
import { defaultCurrency, supportedCurrencyMap } from "../../constants"
import { isSameAddress } from "../../utils"

import { Ask } from "../../types"

import { Button, CenteredFlex, Flex, Text } from "../../styles"
import { ErrorDetail } from "../../components/ErrorDetail"
import { AmountWithCurrency, CurrencySymbol } from "../../components/CurrencySymbol"

const Input = styled.input`
	height: 22px;
`
const Select = styled.select`
	height: 22px;
`

type OfferFormProps = {
	offerDetails: {
		amount: string,
		currency: string
	},
	setOfferDetails: Dispatch<SetStateAction<{ amount: string, currency: string }>>,
	activeAsk?: Ask,
	updateFromPreviousAmount?: string,
	cancelButton?: JSX.Element,
	onSubmit: () => void
}

export function OfferForm({
	offerDetails,
	setOfferDetails,
	activeAsk = undefined,
	updateFromPreviousAmount = undefined,
	cancelButton = undefined,
	onSubmit
}: OfferFormProps) {
	const [ inputValue, setInputValue ] = useState<string>(parseEther(offerDetails.amount).toString())
	const [ error, setError ] = useState<string>("")

	const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget

		setError("")
		if (value === "") {
			setInputValue(value)
			setOfferDetails(obj => ({
				...obj,
				amount: "0"
			}))
			return
		}

		const newValue = parseUnits(value, 18)
		if (activeAsk && isSameAddress(activeAsk.ask_askCurrency, offerDetails.currency) && newValue.gte(activeAsk.ask_askPrice)) {
			const symbol = supportedCurrencyMap[ activeAsk.ask_askCurrency ] || defaultCurrency.symbol
			return setError(`Offer exceeds current ask price (${activeAsk.ask_askPrice} ${symbol}). Consider using the "Buy Now" button instead of making an offer.`)
		}

		setOfferDetails(obj => ({
			...obj,
			amount: newValue.toString()
		}))
		setInputValue(value)
	}, [ activeAsk, setOfferDetails, offerDetails ])

	const handleSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.currentTarget
		
		setOfferDetails(obj => ({
			...obj,
			currency: value
		}))
	}, [ setOfferDetails ])

	return (
		<Flex
			column
			gap={20}>
			{updateFromPreviousAmount && (
				<Flex justify="space-between">
					<Text>Current Offer Amount:</Text>
					<AmountWithCurrency
						amount={formatEther(updateFromPreviousAmount)}
						currency={offerDetails.currency}
					/>
				</Flex>
			)}
			<Flex
				justify="space-between"
				align="center">
				<Text>
					{updateFromPreviousAmount ? "New": "Offer"} Amount:
				</Text>
				<Flex
					align="center"
					gap={4}>
					<Input
						type="text"
						pattern="[0-9.]*"
						name="amount"
						step="any"
						inputMode="decimal"
						value={inputValue}
						onChange={handleChange}
					/>
					{updateFromPreviousAmount
						? <CurrencySymbol currency={offerDetails.currency}/>
						: (
							<Select
								value={offerDetails.currency}
								onChange={handleSelect}>
								{Object.values(supportedCurrencyMap).map(({ id, symbol }, i) => (
									<option
										key={i}
										value={id}>
										{symbol}
									</option>
								))}
							</Select>
						)
					}
				</Flex>
			</Flex>
			{error && <ErrorDetail error={error}/>}
			<CenteredFlex gap={8}>
				{cancelButton}
				<Button
					disabled={!!error}
					onClick={onSubmit}>
					Continue
				</Button>
			</CenteredFlex>
		</Flex>
	)
}