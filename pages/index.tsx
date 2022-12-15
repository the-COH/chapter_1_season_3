import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box } from '@kalidao/reality'
import { Layout } from '~/layout'

const Home: NextPage = () => {
  return (
    <Layout heading="Home" content="Create or join a Kali DAO.">
      <Box></Box>
    </Layout>
  )
}

export default Home
