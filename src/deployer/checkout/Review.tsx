import React, { useEffect, useState } from 'react'
import { Stack, Text, Box, Button } from '@kalidao/reality'
import { FieldSet, Input } from '@kalidao/reality'
import { useDeployStore } from '../useDeployStore'
import Review from './Review'
import * as styles from '../styles.css'

export default function Checkout() {
  const name = useDeployStore((state) => state.name)
  const symbol = useDeployStore((state) => state.symbol)
  const logo = useDeployStore((state) => state.logo)
  const mission = useDeployStore((state) => state.mission)
  const founders = useDeployStore((state) => state.founders)
  const fileReader = new FileReader()

  return (
    <Stack>
      <Row label="Name" value={name} />
      <Row label="Symbol" value={symbol} />
      <Stack>
        <Text weight="semiBold">Founders</Text>
        {founders.map((founder, index) => {
          return <Row key={index} label={founder.address} value={founder.amount} />
        })}
      </Stack>
      <Stack>
        <Text weight="semiBold">Mission</Text>
        <Box className={styles.row}>{mission}</Box>
      </Stack>
    </Stack>
  )
}

const Row = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Box className={styles.row}>
      <Text>{label}</Text>
      <Text weight="bold">{value}</Text>
    </Box>
  )
}
