import React, { useEffect, useState } from 'react'
import { Stack, Box, Button } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from './useDeployStore'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Identity({ setStep }: Props) {
  const founders = useDeployStore((state) => state.founders)
  const addFounderAddress = useDeployStore((state) => state.addFounderAddress)
  const addFounderAmount = useDeployStore((state) => state.addFounderAmount)

  return (
    <Box>
      <FieldSet
        legend="Founders"
        description="You can add up to 10 founders. Each founder will be able to mint tokens and vote on proposals. "
      >
        <Stack>
          {founders.map((founder, index) => (
            <Stack key={index} direction={'horizontal'} justify="space-between">
              <Input
                label="Address"
                placeholder="0x..."
                defaultValue={founders[index].address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => addFounderAddress(index, e.currentTarget.value)}
              />
              <Input
                label="Amount"
                placeholder="1000"
                defaultValue={founders[index].amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  addFounderAmount(index, Number(e.currentTarget.value))
                }
              />
            </Stack>
          ))}
        </Stack>
        <Stack direction={'horizontal'} justify="flex-end">
          <Button variant="transparent" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button variant="primary" onClick={() => setStep(3)}>
            Next
          </Button>
        </Stack>
      </FieldSet>
    </Box>
  )
}
