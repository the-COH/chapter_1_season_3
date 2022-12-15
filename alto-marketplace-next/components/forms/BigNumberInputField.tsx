import { useCallback, useRef, useState } from "react"
import styled from "styled-components"
import { useField } from "formik"
import { FieldValidator } from "formik/dist/types"
import { parseUnits } from "ethers/lib/utils"

const Input = styled.input`
	height: 22px;
`

export type BigNumberFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string
	decimals?: number
	name: string
	max?: string
	min?: string
	validate?: FieldValidator
	placeholder?: string
}

export function BigNumberInputField({
	name,
	decimals = 18,
	min,
	max,
	validate,
	...props
}: BigNumberFieldProps) {
	const [,, helpers ] = useField({ name, validate })
	const { setValue, setTouched } = helpers

	const [ inputValue, setInputValue ] = useState<string>("")
	const previousDecimals = useRef(decimals)
	previousDecimals.current = decimals

	const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget

		if (value === "") {
			setValue(value)
			setInputValue(value)
			return
		}

		try {
			const newValue = parseUnits(value, decimals)
			const invalidValue = (min && newValue.lt(min)) || (max && newValue.gt(max))
			if (invalidValue) {
				return
			}

			setInputValue(value)
			setValue(newValue.toString())
		} catch(e) {
			// don"t update the input on invalid values
			return
		}
	}, [ decimals, max, min, setValue ])

	return (
		<Input
			type="number"
			step="any"
			inputMode="decimal"
			value={inputValue}
			onChange={handleOnChange}
			onBlur={() => setTouched(true)}
			{...props}
		/>
	)
}
