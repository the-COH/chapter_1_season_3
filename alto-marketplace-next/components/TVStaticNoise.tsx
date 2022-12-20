import styled, { keyframes } from "styled-components"
import { CenteredFlex } from "../styles"

const noiseAnim = keyframes`
  0% { transform: translateX(0px,0px); }
  10% { transform: translate(-100px, 100px); }
  20% { transform: translate(150px, -100px); }
  30% { transform: translate(-100px,100px); }
  40% { transform: translate(100px, -150px); }
  50% { transform: translate(-100px, 200px); }
  60% { transform: translate(-200px, -100px); }
  70% { transform: translateY(50px, 100px); }
  80% { transform: translate(100px, -150px); }
  90% { transform: translate(0px, 200px); }
  100% { transform: translate(-100px, 100px); }
`

const Container = styled(CenteredFlex)`
  position: fixed;
  top: 0px;
  left: 0px;
	right: 0px;
	bottom: 0px;
	pointer-events: none;
  z-index: -1;
  
  &:after {
    content: '';
		width: 100vw;
		height: 100vh;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%,rgba(0,0,0,0.75) 80%);
  }
`
const Noise = styled.div`
	position: absolute;
	top: -500px;
	right: -500px;
	bottom: -500px;
	left: -500px;
	background: transparent url('https://www.dropbox.com/s/h7ab1c82ctzy83n/noise.png?raw=1') 0 0;
	background-size: 320px 320px;
	opacity: 0.1;
	animation: ${noiseAnim} 1s steps(8, end) infinite both;
`

export function TVStaticNoise() {
	return (
		<Container>
			<Noise/>
		</Container>
	)
}