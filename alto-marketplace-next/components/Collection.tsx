import { useEffect, useMemo, useReducer, useState } from "react"
import styled, { css } from "styled-components"
import { BigNumber } from "ethers"
import { parseEther } from "ethers/lib/utils"
import { BASE_URL } from "../utils/env-vars"

import { bigZero } from "../constants"
import { Filter, getDefaultFiltersWithTraits, QuerySortOptions } from "../types"

import { useTokenMetadata, useWhitelistedCollection, useWindowWidth } from "../hooks"
import { useCollectionTokensWithMarkets } from "../queries/hooks"

import { Avatar, Button, CenteredFlex, Flex, Text } from "../styles"
import { ErrorOrEmptyPrompt } from "./ErrorOrEmptyPrompt"
import { AddressLink } from "./AddressLink"
import { NFTGallery } from "./NFTGallery"
import { Filters } from "./Filters"
import { SortButton, SortContainer } from "./Sort"
import { CurrencySymbol } from "./CurrencySymbol"

const Container = styled(Flex)`
	width: 100%;
	gap: 48px;
	margin-top: 48px;
`

const HeaderContainer = styled(Flex)`
	height: 360px;
	gap: 12px;
`
const HeaderStat = styled(Flex).attrs(() => ({
	column: true,
	align: "center"
}))`
	min-width: 140px;
	& > * {
		padding: 2px 4px;
		&:last-child {
			color: ${({ theme }) => theme.textColor.tertiary};
			font-size: 10px;
			text-transform: uppercase;
		}
	}
`

const Content = styled(Flex)`
	/* position: relative; */
`
const ContentHeader = styled(Flex)`
	position: sticky;
	top: 79px;
	width: 100%;
	height: 60px;
	padding-left: 12px;
	padding-right: 36px;
	background-color: ${({ theme }) => theme.backgroundColor.primary}dd;
	border-top: ${({ theme }) => theme.border.thin};
	border-bottom: ${({ theme }) => theme.border.thin};
	& > div:first-child {
		max-width: 324px;
	}
	z-index: 1;
`
const ContentBody = styled(Flex)`
	width: 100%;
	min-height: 400px;
	padding: 0 24px;
	position: relative;
`

const FilterContainer = styled(Flex)<{ visible: boolean }>`
	position: absolute;
	top: 58px;
	left: 0px;
	width: 100%;
	background-color: ${({ theme }) => theme.backgroundColor.primary};
	border-bottom: ${({ theme }) => theme.border.thin};
	overflow: hidden;
	display: ${({ visible }) => visible ? "auto": "none"};
	@media(min-width: 768px) {
		position: sticky;
		top: 164px;
		left: auto;
		width: 50%;
		min-width: min(300px, 50%);
		max-width: 300px;
		max-height: calc(100vh - 164px);
		overflow-y: scroll;
		border-bottom: none;
	}
	z-index: 2;
`
const FilterArrow = styled.img<{ expanded: boolean }>`
	width: 20px;
	height: 20px;
	filter: invert();
	transition: transform 0.5s ease;
	transform: rotate(0deg);
	${({ expanded }) => expanded && css`transform: rotate(180deg);`}
	@media(min-width: 768px) {
		transform: rotate(270deg);
		${({ expanded }) => expanded && css`transform: rotate(90deg);`}
	}
`
const FilterIndicator = styled(Flex)`
	padding: 8px 12px;
	border: ${({ theme }) => theme.border.thin};
	border-radius: ${({ theme }) => theme.borderRadius.tiny};
	cursor: pointer;
`

enum SortingOption {
	DEFAULT = "",
	TOKENID_LOWEST = "Token ID - lowest",
	TOKENID_HIGHEST = "Token ID - highest",
	PRICE_LOWEST = "Ask Price - lowest",
	PRICE_HIGHEST = "Ask Price - highest"
}

type CollectionProps = {
	contract: string
}

export function Collection({ contract }: CollectionProps) {
	const [ displayLimit, increaseDisplayLimit ] = useReducer(limit => limit + 100, 100)

	const [ sorting, setSorting ] = useState<SortingOption>(SortingOption.DEFAULT)
	
	const [ sortByTokens, setSortByTokens ] = useState<QuerySortOptions | undefined>(undefined)
	const [ sortByAsks, setSortByAsks ] = useState<QuerySortOptions | undefined>(undefined)

	useEffect(() => {
		switch(sorting) {
			case SortingOption.PRICE_HIGHEST:
				setSortByAsks({
					orderBy: "ask_askPrice",
					orderDirection: "desc"
				})
				break
			case SortingOption.PRICE_LOWEST:
				setSortByAsks({
					orderBy: "ask_askPrice",
					orderDirection: "asc"
				})
				break
			case SortingOption.TOKENID_HIGHEST:
				setSortByTokens({
					orderBy: "identifier",
					orderDirection: "desc"
				})
				setSortByAsks(undefined)
				break
			case SortingOption.TOKENID_LOWEST:
			default:
				setSortByTokens({
					orderBy: "identifier",
					orderDirection: "asc"
				})
				setSortByAsks(undefined)
				break
		}
	}, [ sorting ])

	const {
		loading,
		collection,
		tokensWithMarkets,
		error,
		loadMore
	} = useCollectionTokensWithMarkets({
		contract,
		sortByTokens,
		sortByAsks
	})

	const { metadataTransform = undefined, supply = "???", traits = {}, thumbnail = undefined } = useWhitelistedCollection(contract)

	const { uri, identifier } = tokensWithMarkets[0] || {}

	const { image } = useTokenMetadata(
		!thumbnail
			? {
				contract,
				uri,
				identifier,
				metadataTransform
			}
			: undefined
	)

	const floorPrice = useMemo(() => (
		tokensWithMarkets.reduce((min, { ask = undefined }) => {
			if (!ask) return min
			const price = parseEther(ask.ask_askPrice)
			return price.lt(min) ? price: min
		}, BigNumber.from("0"))
	), [ tokensWithMarkets ])

	const [ sortVisible, setSortVisible ] = useState(false)
	const [ sidebarVisible, setSidebarVisible ] = useState(true)

	const { widerThanMedium } = useWindowWidth()

	useEffect(() => {
		setSidebarVisible(widerThanMedium)
	}, [ widerThanMedium ])

	const [ filterState, setFilterState ] = useState<Filter[]>(getDefaultFiltersWithTraits(traits))

	const clearFilters = () => setFilterState(state => {
		state.forEach(filter => filter.resetAllOptions())
		return [ ...state ]
	})

	const activeFilters = filterState.reduce((arr, filter) => {
		return [ ...arr, ...filter.exportActiveFilters() ]
	}, [] as string[])

	const sortedAndFilteredTokens = useMemo(() => {
		if (!tokensWithMarkets.length) return tokensWithMarkets

		const temp = tokensWithMarkets.filter(token => {
			for (const filter of filterState) {
				if (!filter.filter(token)) return false
			}
			return true
		})

		switch(sorting) {
			case SortingOption.PRICE_LOWEST:
				temp.sort(({ ask: ask1 = undefined }, { ask: ask2 = undefined }) => {
					if (!ask1 && !ask2) return 0
					if (!ask1) return -1
					if (!ask2) return 1

					return BigNumber.from(ask1.ask_askPrice).lt(
							BigNumber.from(ask2.ask_askPrice)
						) ? -1: 1
				})
				break
			case SortingOption.PRICE_HIGHEST:
				temp.sort(({ ask: ask1 = undefined }, { ask: ask2 = undefined }) => {
					if (!ask1 && !ask2) return 0
					if (!ask1) return -1
					if (!ask2) return 1

					return BigNumber.from(ask1.ask_askPrice).lt(
							BigNumber.from(ask2.ask_askPrice)
						) ? 1: -1
				})
				break
		}

		return temp
	}, [ tokensWithMarkets, filterState, sorting ])

	const filterContainer = useMemo(() => (
		<FilterContainer
			column
			visible={sidebarVisible}>
			<Filters
				filterState={filterState}
				setFilterState={setFilterState}
			/>
		</FilterContainer>
	), [ sidebarVisible, filterState ])

	if (error) return (
		<ErrorOrEmptyPrompt>
			<Text>Collection is currently unavailable</Text>
		</ErrorOrEmptyPrompt>
	)

	return (
		<Container
			column
			align="center">
			<HeaderContainer
				column
				align="center">
				<Avatar
					size={240}
					src={thumbnail || image}
					color="rgba(0,0,0,0.3)"
				/>
				<Text
					fontSize={42}
					fontWeight="bold">
					{collection?.name}
				</Text>
				<Flex align="center">
					<HeaderStat>
						<Flex align="center">
							<Text>{floorPrice.gt(bigZero) ? floorPrice.toString(): "--"}&nbsp;</Text>
							<CurrencySymbol/>
						</Flex>
						<Text>Floor Price</Text>
					</HeaderStat>
					<HeaderStat>
						<Text>{supply.toLocaleString()}</Text>
						<Text>Total Supply</Text>
					</HeaderStat>
					<HeaderStat>
						<AddressLink address={contract}/>
						<Text>Contract</Text>
					</HeaderStat>
				</Flex>
			</HeaderContainer>
			{!collection
				? <Text>{loading ? "Loading collection...": "Collection not found"}</Text>
				: !tokensWithMarkets.length
					? <Text>No NFTs found</Text>
					: (
						<Content
							column
							width="100%"
							gap={24}>
							<ContentHeader
								justify="space-between"
								align="center"
								gap={24}>
								<Flex
									justify={widerThanMedium ? "space-between": "flex-start"}
									align="center"
									width="100%"
									gap={12}>
									<Flex
										as="button"
										align="center"
										gap={8}
										onClick={() => {
											if (!widerThanMedium && sortVisible) setSortVisible(false)
											setSidebarVisible(v => !v)
										}}>
										<FilterArrow
											src={`${BASE_URL}/icons/chevron-down.svg`}
											expanded={sidebarVisible}
										/>
										<Text fontSize={28}>Filters</Text>
									</Flex>
									{!!activeFilters.length && <Button onClick={clearFilters}>Clear ({activeFilters.length})</Button>}
								</Flex>
								<Flex
									justify={widerThanMedium ? "space-between": "flex-end"}
									align="center"
									width={widerThanMedium ? "100%": "auto"}>
									{widerThanMedium && (
										<Flex
											flexWrap={true}
											gap={8}>
											{activeFilters.map((str, i) => (
												<FilterIndicator
													key={i}
													align="center"
													gap={12}
													onClick={() => setFilterState(state => {
														const [ filter, option ] = str.split(": ")
														state.find(({ label }) => label === filter)?.resetOption(option)
														return [ ...state ]
													})}>
													<Text>{str}</Text>
													<Text>x</Text>
												</FilterIndicator>
											))}
										</Flex>
									)}
									<SortButton
										label={sorting || "Sort"}
										onClick={() => {
											if (!widerThanMedium && sidebarVisible) setSidebarVisible(false)
											setSortVisible(v => !v)
										}}
									/>
								</Flex>
								<SortContainer
									visible={sortVisible}
									options={[
										SortingOption.TOKENID_LOWEST,
										SortingOption.TOKENID_HIGHEST,
										SortingOption.PRICE_LOWEST,
										SortingOption.PRICE_HIGHEST
									]}
									active={sorting}
									onSelect={(newValue: any) => {
										setSorting(s => s === newValue ? SortingOption.DEFAULT: newValue)
										setSortVisible(false)
									}}
								/>
								{!widerThanMedium && filterContainer}
							</ContentHeader>
							<ContentBody
								justify="flex-start"
								align="flex-start"
								gap={24}>
								{widerThanMedium && filterContainer}
								{loading || !sortedAndFilteredTokens.length
									? (
										<CenteredFlex width="100%">
											<Text>{loading
												? "Loading..."
												: "No NFTs match filter criteria : |"
											}</Text>
										</CenteredFlex>
									)
									: (
										<Flex
											column
											align="center"
											gap={24}>
											<NFTGallery tokens={sortedAndFilteredTokens.slice(0, displayLimit)}/>
											{!!loadMore && (
												<Button
													disabled={loading}
													onClick={loadMore}>
													{loading ? "Loading...": "Load More"}
												</Button>
											)}
											{displayLimit < sortedAndFilteredTokens.length && (
												<Button onClick={increaseDisplayLimit}>
													Show More
												</Button>
											)}
										</Flex>
									)
								}
							</ContentBody>
						</Content>
					)
			}
		</Container>
	)
}