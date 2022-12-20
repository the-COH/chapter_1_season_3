import Link from 'next/link'
import { Box } from '@kalidao/reality'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import * as styles from './styles.css'

export default function Header() {
  return (
    <Box className={styles.header}>
      <Link href="/" passHref>
        <Box as="a" className={styles.logo}>
          KALI
        </Box>
      </Link>
      <ConnectButton label="login" />
    </Box>
  )
}
