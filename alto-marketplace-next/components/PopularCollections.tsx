import { useMemo, useState } from "react"
import Image from "next/image"
import styled from "styled-components"
import { BASE_URL } from "../utils/env-vars"

import { useWindowWidth } from "../hooks"
import { useCollectionsByVolume } from "../queries/hooks"

import { Flex, Grid, Text, TransparentButton } from "../styles"
import { BannerHeader } from "./BannerHeader"
import { CollectionRow } from "./CollectionRow"
import { ErrorOrEmptyPrompt } from "./ErrorOrEmptyPrompt"
import { SortContainer } from "./Sort"

const StaggeredColumn = styled(Flex).attrs(() => ({
	column: true,
	align: "center",
	width: "100%",
	gap: 24
}))`
	max-width: 800px;
	flex-grow: 0;
	& > * {
		margin-left: 16px;
		max-width: calc(100% - 20px);
		&:nth-child(odd) {
			margin-left: 0px;
			margin-right: 16px;
		}
	}

	@media(min-width: 576px) {
		& > * {
			margin-left: 36px;
			max-width: calc(100% - 24px);
			&:nth-child(odd) {
				margin-left: 0px;
				margin-right: 36px;
			}
		}
	}
	@media(min-width: 1024px) {
		max-width: 800px;
	}
`

const RankNumber = styled(Text)`
	width: 36px;
`

const RowHeader = styled(Grid).attrs(() => ({
	columns: "1fr 1fr 1fr",
	gap: 24
}))`
	width: 100%;
	padding: 0 12px;
	margin-left: 88px;
	margin-right: 18px;

	@media(min-width: 1024px) {
		margin-right: 36px;
	}
	@media(min-width: 576px) {
		margin-left: 128px;
		& > *:first-of-type {
			grid-column: 1 / 2;
		}
	}
`

const SinceButton = styled(TransparentButton)`
	position: relative;
	width: 180px;
	height: 36px;
	background-color: ${({ theme }) => theme.backgroundColor.primary} !important;
	font-size: 11px;
	& > *:first-child {
		position: absolute;
		z-index: 1;
	}
	@media(min-width: 768px) {
		font-size: 14px;
	}
`

enum TrendingSince {
	ONE_DAY = "Past 24hrs",
	ONE_WEEK = "Past Week",
	ONE_MONTH = "Past Month",
	ALL_TIME = "All Time"
}

export function PopularCollections() {
	const { widerThanMedium, widerThanLarge } = useWindowWidth()

	const [ dropdownVisible, setDropdownVisible ] = useState(false)
	const [ sorting, setSorting ] = useState<TrendingSince>(TrendingSince.ONE_WEEK)
	const since = useMemo(() => {
		switch(sorting) {
			case TrendingSince.ONE_DAY:
				return Math.floor(Date.now() / 1000) - 1 * 24 * 60 * 60
			case TrendingSince.ONE_WEEK:
				return Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60
			case TrendingSince.ONE_MONTH:
				return Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
			case TrendingSince.ALL_TIME:
				return 0
		}
	}, [ sorting ])
	const { collections, volumes, loading, error } = useCollectionsByVolume({ since })

	const columns = useMemo(() => {
		const splitPoint = Math.ceil(collections.length / 2)
		return [
			collections.slice(0, splitPoint),
			collections.slice(splitPoint)
		]
	}, [ collections ])

	return (
		<Flex
			column
			align="center"
			width="100%"
			gap={48}>
			<BannerHeader text={[ "Popular Collections", "\u2022" ]}>
				<Flex
					width="100%"
					justify="space-between"
					align="center">
					<Text as="h2">
						Popular Collections
					</Text>
					<SinceButton onClick={() => setDropdownVisible(v => !v)}>
						<Flex
							justify="space-between"
							align="center"
							gap={12}>
							<Flex>
								{widerThanMedium && <Text style={{ opacity: 0.75 }}>Sort By:&nbsp;</Text>}
								<Text>{sorting}</Text>
							</Flex>
							<Image
								src={`${BASE_URL}/icons/chevron-down.svg`}
								alt="v"
								width={14}
								height={14}
								style={{ filter: "invert()" }}
							/>
						</Flex>
						<SortContainer
							visible={dropdownVisible}
							options={[
								TrendingSince.ONE_DAY,
								TrendingSince.ONE_WEEK,
								TrendingSince.ONE_MONTH,
								TrendingSince.ALL_TIME,
							]}
							active={sorting}
							onSelect={(newValue: any) => {
								setSorting(s => s === newValue ? TrendingSince.ONE_WEEK: newValue)
								setDropdownVisible(false)
							}}
						/>
					</SinceButton>
				</Flex>
			</BannerHeader>
			<Flex
				column
				width="100%"
				justify="flex-start"
				align="center">
				<Flex
					width="100%"
					column
					gap={12}>
					{error
						? (
							<ErrorOrEmptyPrompt>
								<Text>An error occurred while loading collections</Text>
							</ErrorOrEmptyPrompt>
						)
						: loading
							? (
								<ErrorOrEmptyPrompt>
									<Text>Loading collections...</Text>
								</ErrorOrEmptyPrompt>
							)
							: (<>
								<Flex>
									<RowHeader>
										<Text>Collection</Text>
										<Text>Floor Price</Text>
										<Text>Volume</Text>
									</RowHeader>
									{widerThanLarge && (
										<RowHeader>
											<Text>Collection</Text>
											<Text>Floor Price</Text>
											<Text>Volume</Text>
										</RowHeader>
									)}
								</Flex>
								<Flex
									width="100%"
									column={!widerThanLarge}
									justify={!widerThanLarge ? "stretch": "center"}
									align={!widerThanLarge ? "center": "flex-start"}
									gap={!widerThanLarge ? 24: 0}>
									{!collections.length
										? (
											<ErrorOrEmptyPrompt>
												<Text>No collections found for selected time period</Text>
											</ErrorOrEmptyPrompt>
										)
										: columns.map((arr, i, columnsArr) => (
											<StaggeredColumn key={i}>
												{arr.map((collection, j) => (
													<Flex
														key={collection.id}
														width="100%"
														align="center">
														<RankNumber>{i * (columnsArr[ i - 1 ]?.length || 0) + j + 1}</RankNumber>
														<CollectionRow
															key={collection.id}
															{...collection}
															volume={volumes[ collection.id ]}
														/>
													</Flex>
												))}
											</StaggeredColumn>
										))
									}
								</Flex>
							</>)
					}
				</Flex>
			</Flex>
		</Flex>
	)
}