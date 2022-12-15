import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Stack from '@mui/material/Stack'

import { IconButton as IconButton } from './IconButton'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded'
import FlakyTwoToneIcon from '@mui/icons-material/FlakyTwoTone'
import LeakRemoveTwoToneIcon from '@mui/icons-material/LeakRemoveTwoTone'
import ContactMailSharpIcon from '@mui/icons-material/ContactMailSharp'
import NotificationsActiveSharpIcon from '@mui/icons-material/NotificationsActiveSharp'
import WestIcon from '@mui/icons-material/West'
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined'
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded'

export default {
  title: 'Basic/IconButton',
  component: IconButton,
} as ComponentMeta<typeof IconButton>

const Template: ComponentStory<typeof IconButton> = (args) => (
  <IconButton {...args} onClick={action('clicked')} />
)

export const Playground = Template.bind({})
Playground.args = {
  toolTipProps: { title: 'help' },
}

export const Variants: ComponentStory<typeof IconButton> = () => (
  <Stack spacing={2} maxWidth={300}>
    <Stack spacing={2} maxWidth={300} direction="row">
      <IconButton variant="contained" />
      <IconButton
        variant="contained"
        color="secondary"
        startIcon={<BuildOutlinedIcon />}
      />
      <IconButton
        variant="contained"
        color="success"
        startIcon={<ContactlessRoundedIcon />}
      />
      <IconButton
        variant="contained"
        color="error"
        startIcon={<FlakyTwoToneIcon />}
      />
      <IconButton
        variant="contained"
        color="info"
        startIcon={<ContactMailSharpIcon />}
      />
    </Stack>
    <Stack spacing={2} maxWidth={300} direction="row">
      <IconButton variant="contained" startIcon={<WestIcon />} />
      <IconButton
        variant="contained"
        color="secondary"
        startIcon={<AltRouteOutlinedIcon />}
      />
      <IconButton
        variant="contained"
        color="success"
        startIcon={<Brightness7RoundedIcon />}
      />
      <IconButton
        variant="contained"
        color="error"
        startIcon={<LeakRemoveTwoToneIcon />}
      />
      <IconButton
        variant="contained"
        color="info"
        startIcon={<NotificationsActiveSharpIcon />}
      />
    </Stack>
  </Stack>
)
