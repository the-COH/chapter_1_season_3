import styled from "styled-components"
import { isAddress } from "ethers/lib/utils"
import { parseTime } from "../../utils"

import { useWindowWidth } from "../../hooks"
import { useTokenActivity } from "../../queries/hooks"

import { Flex, Grid, Text } from "../../styles"
import { DetailBox, DetailBoxProps, InnerDetail } from "../../components/DetailBox"
import { AddressLink } from "../../components/AddressLink"
import { AmountWithCurrency } from "../../components/CurrencySymbol"

const InnerDetailContainer = styled(InnerDetail)`
	padding: 0px;
	gap: 8px;
`

const ActivityHeader = styled(Grid)`
	padding: 0 12px;
	grid-template-columns: 2fr 3fr 3fr;
	border-bottom: ${({ theme }) => theme.border.thin};
	& > * {
		padding: 0 12px;
	}
	@media(min-width: 768px) {
		grid-template-columns: 2fr 3fr 3fr 3fr 3fr;
	}
`
const ActivityRow = styled(ActivityHeader)`
	border-bottom: none;
	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
`
const ActivityContent = styled(Flex)`
	width: 100%;
	max-height: 300px;
	gap: 4px;
	overflow-y: scroll;
	padding-bottom: 8px;
	font-size: 13px;

	@media(min-width: 1024px) {
		font-size: 16px;
	}
`

type TokenActivityTableProps = DetailBoxProps & {
	contract: string,
	tokenId?: string
}

export function TokenActivityTable({ contract, tokenId, ...props }: TokenActivityTableProps) {
	const { widerThanMedium } = useWindowWidth()

	const { activity, loading, error } = useTokenActivity({
		contract,
		tokenId
	})

	return (
		<DetailBox
			heading="Token Activity"
			{...props}>
			<InnerDetailContainer column>
				<ActivityHeader>
					<Flex>type</Flex>
					<Flex>date</Flex>
					{widerThanMedium && (<>
						<Flex>to</Flex>
						<Flex>from</Flex>
					</>)}
					<Flex>data</Flex>
				</ActivityHeader>
				{error
					? <Text>An error occurred while fetching token activity</Text>
					: loading
						? <Text>Loading...</Text>
						: (
							<ActivityContent column>
								{activity.map(({ id, eventType, time, buyer = "", seller, amount, currency }) => (
									<ActivityRow key={id}>
										<Flex>
											{eventType}
										</Flex>
										<Flex>
											<Text whiteSpace="nowrap">
												{parseTime(Date.now() / 1000 - time, "ago")}
											</Text>
										</Flex>
										{widerThanMedium && (<>
											<Flex>
												{isAddress(buyer)
													? <AddressLink address={buyer}/>
													: <Text>{buyer}</Text>
												}
											</Flex>
											<Flex>
												<AddressLink address={seller}/>
											</Flex>
										</>)}
										<Flex>
											{amount && currency
												? (
													<AmountWithCurrency
														amount={amount}
														currency={currency}
													/>
												)
												: (
													<AddressLink
														address={id}
														type="tx"
													/>
												)
											}
										</Flex>
									</ActivityRow>
								))}
							</ActivityContent>
						)
				}
			</InnerDetailContainer>
		</DetailBox>
	)
}