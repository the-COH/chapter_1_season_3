import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Stack from '@mui/material/Stack'

import { ButtonGroup } from './ButtonGroup'
import { ButtonProps } from '../../Basic/Button/Button'
import HomeIcon from '@mui/icons-material/Home'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'

export default {
  title: 'Utility/ButtonGroup',
  component: ButtonGroup,
} as ComponentMeta<typeof ButtonGroup>

const Template: ComponentStory<typeof ButtonGroup> = (args) => (
  <ButtonGroup {...args} />
)

const sample = [
  { label: 'Home', startIcon: <HomeIcon />, onClick: action('clicked') },
  {
    label: 'New Split',
    startIcon: <CallSplitIcon />,
    onClick: action('clicked'),
  },
  {
    label: 'New Waterfall',
    startIcon: <WaterfallChartIcon />,
    onClick: action('clicked'),
  },
  {
    label: 'Explore',
    startIcon: <DocumentScannerIcon />,
    onClick: action('clicked'),
  },
] as ButtonProps[]

export const Playground = Template.bind({})
Playground.args = {
  buttons: sample,
}

export const Examples: ComponentStory<typeof ButtonGroup> = () => (
  <Stack spacing={2} width="fit-content">
    <ButtonGroup buttons={sample} />
    <ButtonGroup
      buttons={sample.map((button) => ({
        label: button.label,
        sx: { textTransform: 'none' },
      }))}
      sx={{ width: 'fit-content' }}
    />
    <ButtonGroup iconButtons={sample} />
  </Stack>
)

export const Variants: ComponentStory<typeof ButtonGroup> = () => (
  <Stack spacing={2} width="fit-content">
    <ButtonGroup buttons={sample} color="secondary" variant="text" />
    <ButtonGroup buttons={sample} variant="contained" />
    <ButtonGroup buttons={sample} variant="outlined" />
  </Stack>
)
