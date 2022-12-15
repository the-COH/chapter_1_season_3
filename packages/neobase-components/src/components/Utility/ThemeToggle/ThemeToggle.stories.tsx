import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { ThemeToggle } from './ThemeToggle'

export default {
  title: 'Utility/ThemeToggle',
  component: ThemeToggle,
} as ComponentMeta<typeof ThemeToggle>

const Template: ComponentStory<typeof ThemeToggle> = (args) => (
  <ThemeToggle onClick={action('toggle')} {...args} />
)

export const Playground = Template.bind({})
