import styled, { keyframes } from "styled-components"
import { CenteredFlex } from "../styles"

const spinAnim = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`

const Container = styled(CenteredFlex)<{
	top?: number,
	left?: number,
	right?: number,
	bottom?: number,
	rotDuration: number,
	mb: number
}>`
	position: absolute;
	${({ top }) => top !== undefined && `top: ${top}px;`}
	${({ left }) => left !== undefined && `left: ${left}px;`}
	${({ right }) => right !== undefined && `right: ${right}px;`}
	${({ bottom }) => bottom !== undefined && `bottom: ${bottom}px;`}
	animation: ${spinAnim} ${({ rotDuration }) => rotDuration < 0 ? `reverse ${-rotDuration}`: rotDuration}s linear infinite;
	flex-grow: 0;
	z-index: -1;
	& > * {
		margin-bottom: ${({ mb }) => mb}px;
	}
`

type Triangle = EqTriangleProps & {
	position: {
		top?: number,
		left?: number,
		right?: number,
		bottom?: number
	},
	rotDuration: number
}

type TrianglesProps = {
	triangles: Triangle[],
	thickness?: number,
	color?: string
}

export function Triangles({ triangles, thickness, color }: TrianglesProps) {
	return (<>
		{triangles.map(({ position, rotDuration, ...props }, i) => (
			<Container
				key={i}
				{...position}
				rotDuration={rotDuration}
				mb={props.width / 6}>
				<EquilateralTriangle
					thickness={thickness}
					color={color}
					{...props}
				/>
			</Container>
		))}
	</>)
}

type EqTriangleProps = Omit<TriangleProps, "height">

export function EquilateralTriangle({ width, ...props }: EqTriangleProps) {
	return (
		<Triangle
			width={width}
			height={0.866 * width}
			{...props}
		/>
	)
}

type TriangleProps = {
	width: number,
	height: number,
	thickness?: number,
	color?: string
}

function Triangle({ width, height, thickness = 1, color = "white" }: TriangleProps) {
	return (
		<svg
			width={width.toString()}
			height={height.toString()}>
			<polygon
				points={`
					${thickness},${height - thickness}
					${width / 2},${thickness}
					${width - thickness},${height - thickness}
				`}
				// points="150,30 250,150 50,150"
				fill="transparent"
				stroke={color}
				strokeWidth={thickness.toString()}
			/>
		</svg>
	)
}