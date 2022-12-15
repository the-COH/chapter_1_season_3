import { NextPage } from 'next'
import Layout from '~/dashboard/layout'
import { Box } from '@kalidao/reality'
import Timeline from '~/dashboard/timeline'

const DashboardPage: NextPage = () => {
  return (
    <Layout heading={'Dashboard'} content="Create or vote on a proposal.">
      <Box
        padding={{
          xs: '2',
          md: '6',
        }}
      >
        <Timeline />
      </Box>
    </Layout>
  )
}

export default DashboardPage
