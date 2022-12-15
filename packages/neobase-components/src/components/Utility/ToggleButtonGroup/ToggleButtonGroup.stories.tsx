import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Stack from '@mui/material/Stack'

import { ToggleButtonGroup } from './ToggleButtonGroup'
import HomeIcon from '@mui/icons-material/Home'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'

export default {
  title: 'Utility/ToggleButtonGroup',
  component: ToggleButtonGroup,
} as ComponentMeta<typeof ToggleButtonGroup>

const Template: ComponentStory<typeof ToggleButtonGroup> = (args) => (
  <ToggleButtonGroup {...args} />
)

const sample = [
  { value: 'Home', children: <HomeIcon /> },
  {
    value: 'New Split',
    children: <CallSplitIcon />,
  },
  {
    value: 'New Waterfall',
    children: <WaterfallChartIcon />,
  },
  {
    value: 'Explore',
    children: <DocumentScannerIcon />,
  },
]

export const Playground = Template.bind({})
Playground.args = {
  options: sample,
  value: 'Home',
}

export const Variants: ComponentStory<typeof ToggleButtonGroup> = () => (
  <Stack spacing={2} width="fit-content">
    <ToggleButtonGroup options={sample} value="Home" color="primary" />
    <ToggleButtonGroup options={sample} value="Home" color="secondary" />
    <ToggleButtonGroup options={sample} value="Home" color="info" />
    <ToggleButtonGroup options={sample} value="Home" color="success" />
    <ToggleButtonGroup options={sample} value="Home" color="error" />
  </Stack>
)
