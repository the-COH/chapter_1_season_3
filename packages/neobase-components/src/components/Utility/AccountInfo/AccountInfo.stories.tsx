import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { AccountInfo } from './AccountInfo'
import { Card } from '@mui/material'
import { ethers } from 'ethers'

export default {
  title: 'Utility/AccountInfo',
  component: AccountInfo,
} as ComponentMeta<typeof AccountInfo>

const Template: ComponentStory<typeof AccountInfo> = (args) => {
  const provider = new ethers.providers.InfuraProvider(
    'homestead',
    process.env.STORYBOOK_INFURA_KEY || '',
  )
  return (
    <Card sx={{ width: '500px' }}>
      <AccountInfo {...args} provider={provider} />
    </Card>
  )
}
export const Playground = Template.bind({})
Playground.args = {
  address: '0xc9c022fcfebe730710ae93ca9247c5ec9d9236d0',
  subinfo: 'some info',
  amount: '$5643.87',
}

// export const Examples: ComponentStory<typeof AccountInfo> = () => (
//   <Stack spacing={2} width="fit-content">
//     <AccountInfo buttons={sample} />
//     <AccountInfo
//       buttons={sample.map((button) => ({
//         label: button.label,
//         sx: { textTransform: 'none' },
//       }))}
//       sx={{ width: 'fit-content' }}
//     />
//     <AccountInfo iconButtons={sample} />
//   </Stack>
// )

// export const Variants: ComponentStory<typeof AccountInfo> = () => (
//   <Stack spacing={2} width="fit-content">
//     <AccountInfo buttons={sample} color="secondary" variant="text" />
//     <AccountInfo buttons={sample} variant="contained" />
//     <AccountInfo buttons={sample} variant="outlined" />
//   </Stack>
// )
