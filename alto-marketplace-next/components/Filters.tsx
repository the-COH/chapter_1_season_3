import { Dispatch, Fragment, SetStateAction, useReducer, useState } from "react"
import styled, { css } from "styled-components"
import { BASE_URL } from "../utils/env-vars"

import { Filter } from "../types"

import { Button, CenteredFlex, Flex, FlexProps, Text } from "../styles"

const FilterDropdownContainer = styled(Flex)<{ expanded: boolean }>`
	width: 100%;
	height: ${({ expanded }) => expanded ? "auto": "50px"};
	overflow: hidden;
	&:not(:last-of-type) {
		margin-bottom: -1px;
	}
`
const FilterDropdownHeader = styled(Flex)`
	width: 100%;
	height: 50px;
	padding: 20px 12px;
	font-size: 20px;
	cursor: pointer;
	border-bottom: ${({ theme }) => theme.border.thin};
`
const FilterDropdownArrow = styled.img<{ expanded: boolean }>`
	width: 20px;
	height: 20px;
	filter: invert();
	transition: transform 0.5s ease;
	${({ expanded }) => expanded && css`transform: rotate(180deg);`}
`
const FilterDropdownOptions = styled(Flex)`
	width: 100%;
	border: ${({ theme }) => theme.border.thin};
	border-top: none;
`
const FilterDropdownOption = styled(Flex)`
	width: 100%;
	padding: 20px 12px;
	cursor: pointer;
`
const FilterOptionCheckbox = styled(CenteredFlex)<{ checked: boolean }>`
	width: 20px;
	height: 20px;
	padding: 4px;
	border-radius: 999px;
	border: ${({ theme }) => theme.border.thin};
	color: ${({ theme }) => theme.backgroundColor.primary};
	${({ checked, theme }) => checked && css`background-color: ${theme.accentColor.cream};`}
`
const Checkmark = styled.img`
	width: 12px;
	height: 12px;
`
const FilterInput = styled.input`
	width: 40%;
	height: 24px;
	outline: none;
	border: none;
	background-color: rgba(0,0,0,0.4);
`

type FilterRangeProps = {
	min: number,
	max: number,
	onChange: (value: [ number, number ]) => void
}

function FilterRange({ min, max, onChange }: FilterRangeProps) {
	const [ newMin, setNewMin ] = useState(min)
	const [ newMax, setNewMax ] = useState(max)

	const reset = () => {
		setNewMin(min)
		setNewMax(max)
	}

	return (
		<Flex
			column
			align="center"
			gap={24}
			style={{ padding: "12px" }}>
			<CenteredFlex gap={12}>
				<FilterInput
					type="number"
					placeholder="min"
					min={0}
					max={1e10}
					step={1}
					value={newMin}
					onChange={e => setNewMin(parseInt(e.target.value))}
				/>
				<FilterInput
					type="number"
					placeholder="max"
					min={0}
					max={1e10}
					step={1}
					value={newMax}
					onChange={e => setNewMax(parseInt(e.target.value))}
				/>
			</CenteredFlex>
			<CenteredFlex gap={12}>
				<Button
					disabled={newMin === min && newMax === max}
					onClick={() => onChange([ newMin, newMax ])}>
					Apply
				</Button>
				<Button
					disabled={newMin === min && newMax === max}
					onClick={reset}>
					Cancel
				</Button>
			</CenteredFlex>
		</Flex>
	)
}

type FilterDropdownProps = FlexProps & {
	label: string,
	type: Filter[ "type" ],
	options: Filter[ "options" ],
	onUpdate: (newState: Filter[ "options" ]) => void,
	initialState?: boolean
}

function FilterDropdown({ label, type, options, initialState = false, onUpdate, ...props }: FilterDropdownProps) {
	const [ expanded, toggleExpanded ] = useReducer(e => !e, initialState)

	return (
		<FilterDropdownContainer
			column
			expanded={expanded}
			{...props}>
			<FilterDropdownHeader
				justify="space-between"
				align="center"
				onClick={toggleExpanded}>
				<Text
					fontWeight="lighter"
					fontSize={16}>
					{label}
				</Text>
				<FilterDropdownArrow
					src={`${BASE_URL}/icons/chevron-down.svg`}
					expanded={expanded}
				/>
			</FilterDropdownHeader>
			<FilterDropdownOptions column>
				{type === "boolean"
					? options.map(({ label: optionLabel, value }, i) => (
						<FilterDropdownOption
							key={i}
							justify="space-between"
							align="center"
							width="100%"
							onClick={() => {
								options[i].value = !value
								onUpdate([ ...options ])
							}}>
							<Text textTransform="capitalize">{optionLabel}</Text>
							<FilterOptionCheckbox checked={value as boolean}>
								{value && <Checkmark src={`${BASE_URL}/icons/check.svg`}/>}
							</FilterOptionCheckbox>
						</FilterDropdownOption>
					))
					: options.map(({ value }, i) => (
						<FilterRange
							key={i}
							min={(value as [ number, number ])[0]}
							max={(value as [ number, number ])[1]}
							onChange={newValue => {
								options[i].value = newValue
								onUpdate([ ...options ])
							}}
						/>
					))
				}
			</FilterDropdownOptions>
		</FilterDropdownContainer>
	)
}

const SectionSeparator = styled.div`
	width: 100%;
	height: 0px;
	@media(min-width: 768px) {
		margin: 12px 0px;
	}
`

type FiltersProps = FlexProps & {
	filterState: Filter[],
	setFilterState: Dispatch<SetStateAction<Filter[]>>
}

export function Filters({
	filterState,
	setFilterState,
	...props
}: FiltersProps) {
	return (
		<Flex
			column
			justify="flex-start"
			align="center"
			width="100%"
			{...props}>
			{filterState.map(({ label, ...filterProps }, i) => (
				<Fragment key={i}>
					{i === 2 && <SectionSeparator/>}
					<FilterDropdown
						key={i}
						label={label}
						{...filterProps}
						onUpdate={options => setFilterState(state => {
							state[i].options = options
							return [ ...state ]
						})}
					/>
				</Fragment>
			))}
		</Flex>
	)
}