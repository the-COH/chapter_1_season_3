import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { NumberInput } from './NumberInput'
import { Card } from '@mui/material'
import { Box } from '@mui/system'

export default {
  title: 'Utility/NumberInput',
  component: NumberInput,
} as ComponentMeta<typeof NumberInput>

const Template: ComponentStory<typeof NumberInput> = (args) => (
  <Card sx={{ width: '500px' }}>
    <Box sx={{ p: 1 }}>
      <NumberInput {...args} />
    </Box>
  </Card>
)
export const Playground = Template.bind({})
Playground.args = {
  value: 0,
}
