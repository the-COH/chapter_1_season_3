import { ERC721Token } from "../types"

import { Button, Flex, Separator, Text } from "../styles"
import { AddressLink } from "./AddressLink"
import { NFTHeader } from "./NFTHeader"
import { AmountWithCurrency } from "./CurrencySymbol"

type ContractInteractionStatusProps = {
  title: string,
  tokenAddress?: string,
  tokenId?: string,
  description?: string,
  buttonCopy?: string,
  amount?: string,
  currency?: string,
  token?: ERC721Token,
  onConfirm?: () => void,
  txHash: string,
  previewURL?: string
}

export function ContractInteractionStatus({
  title,
  amount,
  currency,
  token,
  description = 'Once your transaction has been processed it will be reflected on the page. In the meanwhile, you can close this window.',
  buttonCopy = 'Got It',
  onConfirm,
  txHash,
  previewURL,
}: ContractInteractionStatusProps) {
  return (
    <Flex
      column
      gap={12}>
      <Text fontSize={24}>{title}</Text>
      <Text>{description}</Text>
      <Separator />
      <Flex
        column
        gap={12}>
        <Flex
          column
          gap={16}>
          {token && (
            <NFTHeader
              token={token}
              previewURL={previewURL}
            />
          )}
          <Flex gap={32}>
            <Flex column>
              <Text
                fontWeight={700}
                textDecoration="underline">
                Status:
              </Text>
              <Text>Processing</Text>
            </Flex>
            <Flex column>
              <Text
                fontWeight={700}
                textDecoration="underline">
                Transaction Hash:
              </Text>
              <AddressLink
                address={txHash}
                type="tx"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {amount && (
        <Text>
          Listed for:&nbsp;
          <AmountWithCurrency
            amount={amount}
            currency={currency}
          />
        </Text>
      )}
      <Button onClick={onConfirm}>
        {buttonCopy}
      </Button>
    </Flex>
  )
}
