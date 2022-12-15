import { Box } from '@kalidao/reality'
import Head from 'next/head'
import Footer from './Footer'
import Header from './Header'
import * as styles from './styles.css'

export type LayoutProps = {
  heading: string
  content: string
  children?: React.ReactNode
}

export function Layout({ heading, content, children }: LayoutProps) {
  const title = 'Kali | ' + heading

  return (
    <Box>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        <meta name="description" property="og:description" content={content} key="description" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <Box minHeight={'viewHeight'}>
        <Header />
        <Box className={styles.container}>{children}</Box>
      </Box>
      <Footer />
    </Box>
  )
}
