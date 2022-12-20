import React, { useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Layout } from '~/layout'
import { Box } from '@kalidao/reality'
import DeployerWrapper from '~/deployer'
import Back from '~/design/Back'
import * as styles from '~/design/landing.css'

const CreatePage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
  })

  const goto = () => {
    router.push('/')
  }

  return (
    <Layout heading="Create" content="Create a Kali DAO.">
      <Box className={styles.createContainer}>
        <Back onClick={goto} />
        <Box>
          <DeployerWrapper />
        </Box>
      </Box>
    </Layout>
  )
}

export default CreatePage
