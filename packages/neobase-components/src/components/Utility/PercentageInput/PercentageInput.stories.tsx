import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { PercentageInput } from './PercentageInput'
import { Card } from '@mui/material'
import { Box } from '@mui/system'

export default {
  title: 'Utility/PercentageInput',
  component: PercentageInput,
} as ComponentMeta<typeof PercentageInput>

const Template: ComponentStory<typeof PercentageInput> = (args) => (
  <Card sx={{ width: '500px' }}>
    <Box sx={{ p: 1 }}>
      <PercentageInput {...args} />
    </Box>
  </Card>
)
export const Playground = Template.bind({})
Playground.args = {
  value: 0.0,
}
