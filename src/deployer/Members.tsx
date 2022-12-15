import React, { useEffect, useState } from 'react'
import { Stack, Text, Box, Button, IconPlus, IconClose } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from './useDeployStore'
import { useForm, useFieldArray } from 'react-hook-form'

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

interface FormData {
  founders: { address: string; amount: string }[]
}

export default function Identity({ setStep }: Props) {
  const founders = useDeployStore((state) => state.founders)
  const addFounder = useDeployStore((state) => state.addFounder)
  const addFounderAddress = useDeployStore((state) => state.addFounderAddress)
  const addFounderAmount = useDeployStore((state) => state.addFounderAmount)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      founders: founders ?? [{ address: '', amount: '1000' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'founders',
  })

  const back = async (data: FormData) => {
    submit(data)
    setStep(1)
  }

  const next = async (data: FormData) => {
    submit(data)
    setStep(3)
  }

  const submit = async (data: FormData) => {
    const { founders } = data
    console.log('founders', founders)
    founders.forEach((founder, index) => {
      if (index != 0) {
        addFounder()
      }
      addFounderAddress(index, founder.address)
      addFounderAmount(index, founder.amount)
    })
  }

  return (
    <Box>
      <FieldSet
        legend="Founders"
        description="You can add up to 10 founders. Each founder will be able to mint tokens and vote on proposals. "
      >
        <Stack justify="flex-start">
          {fields.map((item, index) => {
            return (
              <Stack key={item.id} direction="horizontal" align="center" justify="center">
                <Input
                  label={`Member`}
                  hideLabel={index !== 0}
                  id="member"
                  {...register(`founders.${index}.address` as const, {
                    required: true,
                  })}
                  defaultValue={item.address}
                  type="text"
                />
                <Input
                  label="Tokens"
                  hideLabel={index !== 0}
                  id="share"
                  type="number"
                  {...register(`founders.${index}.amount` as const, {
                    required: true,
                    min: 1,
                  })}
                  defaultValue={item.amount}
                />
                <Button
                  tone="red"
                  variant="secondary"
                  size="small"
                  shape="circle"
                  onClick={(e) => {
                    e.preventDefault()
                    remove(index)
                  }}
                >
                  <IconClose />
                </Button>
              </Stack>
            )
          })}
          <Button
            suffix={<IconPlus />}
            variant="secondary"
            tone="green"
            onClick={(e) => {
              e.preventDefault()
              append({
                address: '',
                amount: '1000',
              })
            }}
          >
            Add
          </Button>
        </Stack>
        <Stack direction={'horizontal'} justify="flex-end">
          <Button variant="transparent" type="submit" onClick={handleSubmit(back)}>
            Back
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit(next)}>
            Next
          </Button>
        </Stack>
      </FieldSet>
    </Box>
  )
}
