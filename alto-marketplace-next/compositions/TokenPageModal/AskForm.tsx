import { useCallback, useState } from "react"
import * as Yup from "yup"
import { Form, Formik, FormikHelpers } from "formik"
import { BigNumber, ContractTransaction } from "ethers"
import { defaultCurrency, supportedCurrencyMap } from "../../constants"

import { Ask, Currency } from "../../types"

import { useContractContext } from "../../providers"
import { useAuth, useContractTransaction } from "../../hooks"

import { CenteredFlex, Flex, Text } from "../../styles"
import { BigNumberInputField, CurrencyDropdown } from "../../components/forms"
import { ErrorDetail } from "../../components/ErrorDetail"
import { TransactionSubmitButton } from "../../components/TransactionSubmitButton"
import { AmountWithCurrency, PercentageOfAmountWithCurrency } from "../../components/CurrencySymbol"

export const fixedPriceSchema = Yup.object().shape({
  currency: Yup.object().required(),
  amount: Yup.number().required("List price is a required value"),
  listingFeePercentage: Yup.number().optional(),
  findersFeeBps: Yup.number().min(0).max(10),
})

type AskFormProps = {
  tokenId: string,
  tokenAddress: string,
  updateAsk?: Ask,
  creatorFee?: number,
  onConfirmation: (txHash: string, amount: string, currencyAddress: string) => void,
  cancelButton?: JSX.Element
}

type AskFormState = {
  currency: Currency,
  amount: BigNumber,
  findersFeeBps: number
}

const initialValues: AskFormState = {
  currency: defaultCurrency,
  amount: BigNumber.from(0),
  findersFeeBps: 0,
}

export function AskForm({
  tokenId,
  tokenAddress,
  updateAsk = undefined,
  creatorFee = 0,
  onConfirmation,
  cancelButton,
}: AskFormProps) {
  const { address } = useAuth()
  const [ error, setError ] = useState<string>()
  const { AsksManager } = useContractContext()
  const { txStatus, handleTx, txInProgress } = useContractTransaction()

  const handleOnSubmit = useCallback(async (
    values: AskFormState,
    { setSubmitting }: FormikHelpers<AskFormState>
  ) => {
    try {
      if (!address || !AsksManager) {
        throw new Error("AskContract is not ready, please try again.")
      }

      setSubmitting(true)
      const executeAsk = (): Promise<ContractTransaction> => {
        if (updateAsk) {
          const args: any[] = [
            tokenAddress,      // _tokenContract
            tokenId,           // _tokenId
            values.amount,     // _askPrice
            values.currency.id // _askCurrency
          ]
          console.log("setAskPrice:", args)
          return AsksManager.setAskPrice(...args)
        }

        const args: any[] = [
          tokenAddress,       // _tokenContract
          tokenId,            // _tokenId
          values.amount,      // _askPrice
          values.currency.id, // _askCurrency
          address,            // _sellerFundsRecipient
          values.findersFeeBps * 100
        ]
        console.log("createAsk:", args)
        return AsksManager.createAsk(...args)
      }
      const promise = executeAsk()
      const tx = await handleTx(promise)
      onConfirmation(tx.hash, values.amount.toString(), values.currency.id)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "There's been an error, please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [ AsksManager, address, handleTx, updateAsk, onConfirmation, tokenAddress, tokenId ])

  return (
    <Formik
      initialValues={updateAsk
        ? {
          currency: supportedCurrencyMap[ updateAsk.ask_askCurrency.toLowerCase() ] || {
            id: updateAsk.ask_askCurrency.toLowerCase(),
            decimals: 18,
            symbol: "???"
          },
          amount: BigNumber.from(updateAsk.ask_askPrice),
          findersFeeBps: 0
        }
        : initialValues
      }
      validationSchema={fixedPriceSchema}
      onSubmit={handleOnSubmit}>
      {({ values, isValid }) => (
        <Form>
          <Flex
            column
            gap={20}>
            {updateAsk && (
              <Flex justify="space-between">
                <Text>Current List Price:</Text>
                <AmountWithCurrency
                  amount={updateAsk.ask_askPrice}
                  currency={updateAsk.ask_askCurrency}
                />
              </Flex>
            )}
            <Flex
              justify="space-between"
              align="center">
              <Text>
                {updateAsk ? "New": "NFT"} Price:
              </Text>
              <Flex
                align="center"
                gap={4}>
                <BigNumberInputField
                  type="text"
                  pattern="[0-9.]*"
                  name="amount"
                  min={"0"}
                  placeholder="0.00"
                  decimals={values.currency.decimals}
                />
                <CurrencyDropdown
                  name="currency"
                  value={values.currency.id}
                  decimals={values.currency.decimals}
                />
              </Flex>
            </Flex>
            <Flex
              justify="space-between"
              align="center">
              <Text>Creator Fee ({(creatorFee * 100).toFixed(1)}%):</Text>
              <PercentageOfAmountWithCurrency
                percentage={creatorFee}
                amount={values.amount.toString()}
                currency={values.currency.id}
              />
            </Flex>
            {error && <ErrorDetail error={error}/>}
            <CenteredFlex gap={8}>
              {cancelButton}
              <TransactionSubmitButton
                txStatus={txStatus}
                txInProgress={txInProgress}
                disabled={!isValid}>
                {updateAsk ? "Update": "List"}
              </TransactionSubmitButton>
            </CenteredFlex>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}