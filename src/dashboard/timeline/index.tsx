import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Box,
  Stack,
  Button,
  Skeleton,
  Heading,
  Card as CardComponent,
  IconPencil,
  IconBookOpen,
  Text,
} from '@kalidao/reality'
import { useDaoStore } from '../useDaoStore'

export default function Timeline() {
  const address = useDaoStore((state) => state.address)
  const chainId = useDaoStore((state) => state.chainId)
  const name = useDaoStore((state) => state.token.name)
  const text = `We could not find any proposals for ${name}.`

  return (
    <Stack>
      <Stack direction="horizontal" align="center" justify={'flex-end'}>
        <Link
          href={{
            pathname: '/daos/[chainId]/[dao]/propose',
            query: {
              dao: address,
              chainId: chainId,
            },
          }}
          passHref
        >
          <Button as="a" shape="circle">
            <IconPencil />
          </Button>
        </Link>
      </Stack>
      <Skeleton>
        <Stack>
          <CardComponent padding="6">
            <Stack>
              <Heading level="2">{text}</Heading>
              <Text wordBreak="break-word">
                You can create proposals to add and remove members, interact with external contracts and install apps.
              </Text>
            </Stack>
          </CardComponent>
        </Stack>
      </Skeleton>
    </Stack>
  )
}
