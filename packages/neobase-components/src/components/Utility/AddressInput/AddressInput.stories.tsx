import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AddressInput } from './AddressInput'
import { Card } from '@mui/material'
import { Box } from '@mui/system'
import { ethers } from 'ethers'

export default {
  title: 'Utility/AddressInput',
  component: AddressInput,
} as ComponentMeta<typeof AddressInput>

const Template: ComponentStory<typeof AddressInput> = (args) => {
  const provider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.STORYBOOK_INFURA_KEY || '',
  )
  return (
    <Card sx={{ width: '500px' }}>
      <Box sx={{ p: 1 }}>
        <AddressInput {...args} provider={provider} />
      </Box>
    </Card>
  )
}
export const Playground = Template.bind({})
Playground.args = {
  value: '',
}
