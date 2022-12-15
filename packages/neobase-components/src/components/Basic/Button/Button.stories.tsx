import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Stack from '@mui/material/Stack'

import { Button } from './Button'

export default {
  title: 'Basic/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => (
  <Button onClick={action('clicked')} {...args} />
)

export const Playground = Template.bind({})
Playground.args = {
  label: 'hover for help',
  toolTipProps: { title: 'help' },
}

export const Variants: ComponentStory<typeof Button> = () => (
  <Stack spacing={2} maxWidth={300}>
    <Button variant="text" label="Text Button" />
    <Button variant="contained" label="Contained Button" />
    <Button variant="outlined" label="Outlined Button" />
  </Stack>
)

export const Colors: ComponentStory<typeof Button> = () => (
  <Stack spacing={2} maxWidth={300}>
    <Button variant="contained" label="Primary" />
    <Button variant="contained" color="secondary" label="Secondary" />
    <Button variant="contained" color="success" label="Success" />
    <Button variant="contained" color="error" label="Error" />
  </Stack>
)

export const Sizes: ComponentStory<typeof Button> = () => (
  <Stack spacing={2} maxWidth={300}>
    <Button variant="contained" size="small" label="Small" />
    <Button variant="contained" size="medium" label="Medium" />
    <Button variant="contained" size="large" label="Large" />
  </Stack>
)
