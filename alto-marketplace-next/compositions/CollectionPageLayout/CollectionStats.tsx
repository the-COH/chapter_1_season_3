import styled from "styled-components"
import { formatCryptoVal } from "../../utils"

import { useWindowWidth } from "../../hooks"
import { useCollectionVolume } from "../../queries/hooks"

import { Flex, Grid, Text } from "../../styles"
import { CurrencySymbol } from "../../components/CurrencySymbol"

const StatContainer = styled(Flex).attrs(() => ({
	column: true
}))`
	align-items: center;

	& > * {
		padding: 2px 4px;
		&:first-child {
			font-size: 20px;
		}
		&:last-child {
			color: ${({ theme }) => theme.textColor.tertiary};
			font-size: 11px;
		}
	}
	@media(min-width: 768px) {
		align-items: flex-start;
		& > *:first-child {
			font-size: 32px;
		}
	}
`

type CollectionStatsProps = {
	contract: string,
	floorPrice?: {
		amount: string,
		currency: string,
		convertedAmount: number
	},
	owners: number
}

export function CollectionStats({ contract, floorPrice, owners }: CollectionStatsProps) {
	const { widerThanMedium } = useWindowWidth()

	const {
    volTotal,
    vol24hr,
    loading: volLoading,
    error: volError
  } = useCollectionVolume({ contract })

	return (
		<Grid
			columns={widerThanMedium ? "1fr 1fr 1fr 1fr": "1fr 1fr"}
			rows={widerThanMedium ? "1fr": "1fr 1fr"}
			gap={36}>
			<StatContainer>
				<Flex align="center">
					<Text>{volError || volLoading || !vol24hr
						? "--"
						: formatCryptoVal(vol24hr, 0)
					}</Text>
					&nbsp;
					<CurrencySymbol fontSize={widerThanMedium ? 24: 16}/>
				</Flex>
				<Text>24hr Volume</Text>
			</StatContainer>
			<StatContainer>
				<Flex align="center">
					<Text>{volError || volLoading || !volTotal
						? "--"
						: formatCryptoVal(volTotal, 0)
					}</Text>
					&nbsp;
					<CurrencySymbol fontSize={widerThanMedium ? 24: 16}/>
				</Flex>
				<Text>Total Volume</Text>
			</StatContainer>
			<StatContainer>
				<Flex align="center">
					<Text>{floorPrice && floorPrice.convertedAmount !== 0
						? formatCryptoVal(floorPrice.amount)
						: "--"
					}</Text>
					&nbsp;
					<CurrencySymbol
						fontSize={widerThanMedium ? 24: 16}
						currency={floorPrice?.currency || undefined}
					/>
				</Flex>
				<Text>Floor Price</Text>
			</StatContainer>
			<StatContainer>
				<Text>{owners ? owners.toLocaleString(): "--"}</Text>
				<Text>Owners</Text>
			</StatContainer>
		</Grid>
	)
}