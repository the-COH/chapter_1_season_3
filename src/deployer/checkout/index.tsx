import React, { useEffect, useState } from 'react'
import { Stack, Box, Button } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from '../useDeployStore'
import Review from './Review'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Checkout({ setStep }: Props) {
  const deploy = () => {}

  return (
    <Box>
      <Review />
      <Stack>
        <Button variant="transparent" type="button" onClick={() => setStep(2)}>
          Back
        </Button>
        <Button variant="primary" type="button" onClick={() => deploy()}>
          Summon
        </Button>
      </Stack>
    </Box>
  )
}
