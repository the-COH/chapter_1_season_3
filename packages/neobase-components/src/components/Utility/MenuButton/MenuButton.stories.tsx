import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { MenuButton } from './MenuButton'
import HomeIcon from '@mui/icons-material/Home'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup'

export default {
  title: 'Utility/MenuButton',
  component: MenuButton,
} as ComponentMeta<typeof MenuButton>

const Template: ComponentStory<typeof MenuButton> = (args) => (
  <MenuButton {...args} />
)

export const Playground = Template.bind({})
Playground.args = {
  buttons: [
    {
      label: 'Home',
      onClick: action('home clicked'),
      disabled: false,
      startIcon: <HomeIcon />,
    },
    {
      label: 'Button 2',
      onClick: action('button 2 clicked'),
      disabled: false,
      startIcon: <WifiProtectedSetupIcon />,
    },
    {
      label: 'Explore',
      onClick: action('explore clicked'),
      disabled: false,
      startIcon: <DocumentScannerIcon />,
    },
  ],
}
