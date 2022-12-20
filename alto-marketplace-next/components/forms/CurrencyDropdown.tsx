import { useCallback } from "react"
import { useField } from "formik"
import { FieldValidator } from "formik/dist/types"
import styled from "styled-components"
import { supportedCurrencyMap } from "../../constants"

const Select = styled.select`
	height: 22px;
`

export type CurrencyDropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	className?: string
	value: string
	decimals?: number
	name: string
	validate?: FieldValidator
}

export function CurrencyDropdown({
	value,
	decimals,
	name,
	validate,
	...props
}: CurrencyDropdownProps) {
	const [,, helpers ] = useField({ name, validate })
	const { setValue, setTouched } = helpers
	
	const handleOnChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.currentTarget

		setValue(supportedCurrencyMap[ value ])
	}, [ decimals, setValue ])

	return (
		<Select
			name={name}
			value={value}
			onChange={handleOnChange}
			onBlur={() => setTouched(true)}
			{...props}>
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
