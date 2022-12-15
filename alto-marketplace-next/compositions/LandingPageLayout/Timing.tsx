import styled from "styled-components"
import { parseTime } from "../../utils"

import { Text } from "../../styles"

const TimingText = styled(Text)`
	color: ${({ theme }) => theme.textColor.tertiary};
`

type TimingProps = {
	timestamp?: string
}

export function Timing({ timestamp = "0" }: TimingProps) {
	const time = parseTime(Date.now() / 1000 - parseInt(timestamp), "ago")

	return (
		<TimingText fontWeight="lighter">{time}</TimingText>
	)
}