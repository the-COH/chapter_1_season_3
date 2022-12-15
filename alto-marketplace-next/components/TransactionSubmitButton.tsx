import React, { ReactNode, useMemo } from "react"
import styled from "styled-components"

import { WalletCallStatus } from "../hooks"

import { Button, Text } from "../styles"

const Container = styled(Button)`
  flex-grow: 1;
	border-radius: 999px;
`

type TransactionSubmitButtonProps = {
  disabled?: boolean,
  loading?: boolean,
  onClick?: () => void,
  txInProgress: boolean,
  txStatus: WalletCallStatus,
  children: ReactNode | ReactNode[] | JSX.Element
}

export function TransactionSubmitButton({
  children,
  disabled,
  loading,
  txInProgress,
  txStatus,
  ...props
}: TransactionSubmitButtonProps) {
  const isLoading = useMemo(() => (
    txStatus === WalletCallStatus.CONFIRMING || txInProgress || loading
  ), [ loading, txInProgress, txStatus ])

  const isDisabled = isLoading || disabled

  return (
    <Container
      // loading={isLoading}
      disabled={isDisabled}
      {...props}>
      {(txStatus === WalletCallStatus.ERRORED
        ? <Text>Try Again</Text>
        : txStatus === WalletCallStatus.PROMPTED
          ? <Text>Waiting for approval...</Text>
          : txStatus === WalletCallStatus.CONFIRMING
            ? <Text>Confirming...</Text>
            : children
      )}
    </Container>
  )
}
