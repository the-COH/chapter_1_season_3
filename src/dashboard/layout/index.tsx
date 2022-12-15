import { Layout, LayoutProps } from '~/layout'
import { Box, Stack } from '@kalidao/reality'
import * as styles from './styles.css'

export default function DashboardLayout({ heading, content, children }: LayoutProps) {
  return (
    <Layout heading={heading} content={content}>
      <Box className={styles.container}>
        <Stack>
          <Stack
            direction={{
              xs: 'vertical',
              lg: 'horizontal',
            }}
            justify="space-between"
          >
            {/* <Profile address={dao as string} chainId={Number(chainId)} />
            <Nav address={dao as string} chainId={Number(chainId)} />
            <Treasury address={dao as string} chainId={Number(chainId)} />
            <Members /> */}
          </Stack>
          {children}
        </Stack>
      </Box>
    </Layout>
  )
}
