import React, { useEffect, useState } from 'react'
import { Stack, Box, Button, MediaPicker } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from './useDeployStore'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Identity({ setStep }: Props) {
  const name = useDeployStore((state) => state.name)
  const setName = useDeployStore((state) => state.setName)
  const symbol = useDeployStore((state) => state.symbol)
  const setSymbol = useDeployStore((state) => state.setSymbol)

  return (
    <Box>
      <FieldSet
        legend="Token"
        description="Your token is the identity of your organization. The token created will be ERC20 compliant."
      >
        <Input
          label="Name"
          placeholder="KaliCo"
          defaultValue={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
        />
        <Input
          label="Symbol"
          placeholder="KCO"
          prefix="$"
          textTransform="uppercase"
          defaultValue={symbol}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymbol(e.currentTarget.value)}
        />
        <Stack direction={'horizontal'} justify="flex-end">
          <Button variant="primary" type="submit" onClick={() => setStep(1)}>
            Next
          </Button>
        </Stack>
      </FieldSet>
    </Box>
  )
}
