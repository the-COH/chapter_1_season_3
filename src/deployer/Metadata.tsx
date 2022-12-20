import React, { useEffect, useState } from 'react'
import { Stack, Box, Button, MediaPicker, Textarea } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from './useDeployStore'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Identity({ setStep }: Props) {
  const setLogo = useDeployStore((state) => state.setLogo)
  const mission = useDeployStore((state) => state.mission)
  const setMission = useDeployStore((state) => state.setMission)

  return (
    <Box>
      <FieldSet legend="Metadata" description="You can specify a logo and a mission for your DAO.">
        <MediaPicker accept="image/jpeg, image/png, image/webp" label="Logo" onChange={(file: File) => setLogo(file)} />
        <Textarea
          label="Mission"
          placeholder="Our mission is to..."
          autoCorrect="true"
          spellCheck="true"
          defaultValue={mission}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMission(e.currentTarget.value)}
        />
        <Stack direction={'horizontal'} justify="flex-end">
          <Button variant="transparent" type="button" onClick={() => setStep(0)}>
            Back
          </Button>
          <Button variant="primary" type="button" onClick={() => setStep(2)}>
            Next
          </Button>
        </Stack>
      </FieldSet>
    </Box>
  )
}
