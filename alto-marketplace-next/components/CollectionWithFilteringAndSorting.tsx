import { Dispatch, SetStateAction, useEffect, useMemo, useReducer, useState } from "react"
import styled, { css } from "styled-components"
import Image from "next/image"
import { BASE_URL } from "../utils/env-vars"
import { convertCurrencyToCanto } from "../utils"

import { defaultFilters, ERC721Token, Filter, QuerySortOptions } from "../types"

import { useWindowWidth } from "../hooks"

import { Button, CenteredFlex, Flex, Text, TransparentButton } from "../styles"
import { ErrorOrEmptyPrompt } from "./ErrorOrEmptyPrompt"
import { NFTGallery } from "./NFTGallery"
import { Filters } from "./Filters"
import { SortContainer } from "./Sort"

const Content = styled(Flex)`
	/* position: relative; */
`
const ContentHeader = styled(Flex)`
	position: sticky;
	top: 79px;
	width: 100%;
	height: 80px;
	padding: 0 12px;
	/* background-color: ${({ theme }) => theme.backgroundColor.primary}dd; */
	border-top: ${({ theme }) => theme.border.thin};
	& > div:first-child {
		max-width: 324px;
	}
	z-index: 1;
`
const SortButton = styled(TransparentButton)`
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
		width: 256px;
		font-size: 14px;
	}
`

const ContentBody = styled(Flex)`
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
		background-color: transparent;
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
	TOKENID_LOWEST = "Token ID - Low to High",
	TOKENID_HIGHEST = "Token ID - High to Low",
	PRICE_LOWEST = "Ask Price - Low to High",
	PRICE_HIGHEST = "Ask Price - High to Low"
}

type CollectionProps = {
	tokens: ERC721Token[],
	traitFilters?: Filter[],
	collectionFilters?: Filter[],
	loading?: boolean,
	error?: any,
	showCount?: boolean,
	setSortByTokens?: Dispatch<SetStateAction<QuerySortOptions | undefined>>,
	setSortByAsks?: Dispatch<SetStateAction<QuerySortOptions | undefined>>
}

// avoid default assignment of generic empty array causing runaway useEffect loop
const emptyTraitFilters: Filter[] = []
const emptyCollectionFilters: Filter[] = []

export function CollectionWithFilteringAndSorting({
	tokens,
	traitFilters = emptyTraitFilters,
	collectionFilters = emptyCollectionFilters,
	loading,
	error,
	showCount,
	setSortByTokens,
	setSortByAsks
}: CollectionProps) {
	const [ displayLimit, increaseDisplayLimit ] = useReducer(limit => limit + 100, 100)

	const [ sorting, setSorting ] = useState<SortingOption>(SortingOption.TOKENID_LOWEST)

	useEffect(() => {
		switch(sorting) {
			case SortingOption.PRICE_HIGHEST:
				setSortByAsks && setSortByAsks({
					orderBy: "ask_askPrice",
					orderDirection: "desc"
				})
				break
			case SortingOption.PRICE_LOWEST:
				setSortByAsks && setSortByAsks({
					orderBy: "ask_askPrice",
					orderDirection: "asc"
				})
				break
			case SortingOption.TOKENID_HIGHEST:
				setSortByTokens && setSortByTokens({
					orderBy: "identifier",
					orderDirection: "desc"
				})
				setSortByAsks && setSortByAsks(undefined)
				break
			case SortingOption.TOKENID_LOWEST:
			default:
				setSortByTokens && setSortByTokens({
					orderBy: "identifier",
					orderDirection: "asc"
				})
				setSortByAsks && setSortByAsks(undefined)
				break
		}
	}, [ sorting, setSortByAsks, setSortByTokens ])

	const [ sortVisible, setSortVisible ] = useState(false)
	const [ sidebarVisible, setSidebarVisible ] = useState(true)

	const { widerThanMedium } = useWindowWidth()

	useEffect(() => {
		setSidebarVisible(widerThanMedium)
	}, [ widerThanMedium ])

	const [ filterState, setFilterState ] = useState<Filter[]>(defaultFilters)

	useEffect(() => {
		setFilterState([
			...defaultFilters,
			...traitFilters,
			...collectionFilters
		])
	}, [ traitFilters, collectionFilters ])

	const clearFilters = () => setFilterState(state => {
		state.forEach(filter => filter.resetAllOptions())
		return [ ...state ]
	})

	const activeFilters = filterState.reduce((arr, filter) => {
		return [ ...arr, ...filter.exportActiveFilters() ]
	}, [] as string[])
	
	const parsedTraitFilters = useMemo(() => {
		if (!traitFilters.length) return undefined

		const obj = traitFilters.reduce((acc, { label, options }) => {
			for (const option of options) {
				if (option.value) {
					if (acc[ label ]) acc[ label ].push(option.label)
					else acc[ label ] = [ option.label ]
				}
			}
			return acc
		}, {} as { [ key: string ]: string[] })

		return Object.keys(obj).length > 0 ? obj: undefined
	}, [ filterState, traitFilters ])

	const sortedAndFilteredTokens = useMemo(() => {
		if (!tokens || !tokens.length) return []
		const temp = tokens.filter(token => {
			for (const filter of filterState) {
				if (!filter.filter(token)) return false
			}
			return true
		}) as any[]

		switch(sorting) {
			case SortingOption.PRICE_LOWEST:
				temp.sort(({ ask: ask1 = undefined }, { ask: ask2 = undefined }) => {
					if (!ask1 && !ask2) return 0
					if (!ask2) return -1
					if (!ask1) return 1

					return convertCurrencyToCanto(
						ask1.ask_askPrice,
						ask1.ask_askCurrency
					) < convertCurrencyToCanto(
						ask2.ask_askPrice,
						ask2.ask_askCurrency
					) ? -1: 1
				})
				break
			case SortingOption.PRICE_HIGHEST:
				temp.sort(({ ask: ask1 = undefined }, { ask: ask2 = undefined }) => {
					if (!ask1 && !ask2) return 0
					if (!ask2) return -1
					if (!ask1) return 1

					return convertCurrencyToCanto(
						ask1.ask_askPrice,
						ask1.ask_askCurrency
					) < convertCurrencyToCanto(
						ask2.ask_askPrice,
						ask2.ask_askCurrency
					) ? 1: -1
				})
				break
		}

		return temp
	}, [ tokens, filterState, sorting ])

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
						<Text fontSize={widerThanMedium ? 28: 20}>Filters</Text>
					</Flex>
					{!!activeFilters.length && (
						<Button onClick={clearFilters}>
							{widerThanMedium
								? `Clear (${activeFilters.length})`
								: "x"
							}
						</Button>
					)}
				</Flex>
				<Flex
					justify="flex-end"
					align="center"
					width="100%">
					{(!!setSortByTokens || !!setSortByAsks) && (
						<SortButton onClick={() => {
							if (!widerThanMedium && sidebarVisible) setSidebarVisible(false)
							setSortVisible(v => !v)
						}}>
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
								visible={sortVisible}
								options={[
									...(!!setSortByTokens
										? [
											SortingOption.TOKENID_LOWEST,
											SortingOption.TOKENID_HIGHEST
										]
										: []
									),
									...(!!setSortByAsks
										? [
											SortingOption.PRICE_LOWEST,
											SortingOption.PRICE_HIGHEST
										]
										: []
									)
								]}
								active={sorting}
								onSelect={(newValue: any) => {
									setSorting(s => s === newValue ? SortingOption.TOKENID_LOWEST: newValue)
									setSortVisible(false)
								}}
							/>
						</SortButton>
					)}
				</Flex>
				{!widerThanMedium && filterContainer}
			</ContentHeader>
			<ContentBody
				justify="flex-start"
				align="flex-start"
				gap={24}>
				{widerThanMedium && filterContainer}
				<Flex
					column
					align="center"
					gap={24}
					grow={1}>
					{widerThanMedium && !!activeFilters.length && (
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
					{(loading || !tokens.length || !sortedAndFilteredTokens.length)
						? (
							<CenteredFlex>
								<Text>{loading
									? "Loading..."
									: !tokens.length
										? "No NFTs found for this address"
										: "No NFTs match filter criteria : |"
								}</Text>
							</CenteredFlex>
						)
						: showCount && (
							<Flex
								width="100%"
								justify="space-between"
								align="center">
								<CenteredFlex></CenteredFlex>
								<Text>
									{sortedAndFilteredTokens.length.toLocaleString()} items
								</Text>
							</Flex>
						)
					}
					<NFTGallery
						tokens={sortedAndFilteredTokens.slice(0, displayLimit)}
						traitFilters={parsedTraitFilters}
					/>
					{displayLimit < sortedAndFilteredTokens.length && (
						<Button onClick={increaseDisplayLimit}>
							Show More
						</Button>
					)}
				</Flex>
			</ContentBody>
		</Content>
	)
}