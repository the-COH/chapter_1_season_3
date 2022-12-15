import { SplitsClient, fetchMetaData } from '@neobase-one/splits-sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { AccountInfoProps } from '@neobase-one/neobase-components/lib/components/Utility/AccountInfo/AccountInfo'
import { useProvider } from 'wagmi'
import { Provider } from '@ethersproject/providers'
const getSplitEarningsInfo = async (
  splitsClient: SplitsClient,
  splitId: string,
  includeActiveBalances: boolean,
  provider: Provider,
) => {
  const earnings = await splitsClient.getSplitEarnings({
    splitId: splitId,
    includeActiveBalances: includeActiveBalances,
  })

  let activeAmount = 0
  let distributedAmount = 0

  const activeBalances = await Promise.all(
    Object.keys(earnings.activeBalances!).map(async (key) => {
      const metaData = await fetchMetaData(provider, [key])
      const amount = Number(
        formatEther(BigNumber.from(earnings.activeBalances![key])),
      ).toFixed(3)
      activeAmount += Number(amount) * Number(metaData[0].price)
      return {
        address: `${amount} ${metaData[0].name}`,
        amount: `$${(Number(amount) * Number(metaData[0].price)).toFixed(5)}`,
        avatarSrc: metaData[0].image,
      } as AccountInfoProps
    }),
  )

  const distributions = await Promise.all(
    Object.keys(earnings.distributed!).map(async (key) => {
      const metaData = await fetchMetaData(provider, [key])
      const amount = Number(
        formatEther(BigNumber.from(earnings.distributed![key])),
      ).toFixed(3)
      distributedAmount += Number(amount) * Number(metaData[0].price)
      return {
        address: `${amount} ${metaData[0].name}`,
        amount: `$${(Number(amount) * Number(metaData[0].price)).toFixed(5)}`,
        avatarSrc: metaData[0].image,
      } as AccountInfoProps
    }),
  )

  const totalAmount = (activeAmount + distributedAmount).toFixed(2)
  return {
    activeAmount: activeAmount.toFixed(5),
    activeBalances,
    distributedAmount: distributedAmount.toFixed(5),
    distributions,
    totalAmount,
  }
}

const getUserEarningsInfo = async (
  splitsClient: SplitsClient,
  userId: string,
  provider: Provider,
) => {
  const earnings = await splitsClient.getUserEarnings({
    userId: userId,
  })

  let activeAmount = 0
  let withdrawnAmount = 0

  const activeBalances = await Promise.all(
    Object.keys(earnings.activeBalances!).map(async (key) => {
      const metaData = await fetchMetaData(provider, [key])
      const amount = Number(
        formatEther(BigNumber.from(earnings.activeBalances![key])),
      ).toFixed(3)
      activeAmount += Number(amount) * Number(metaData[0].price)
      return {
        address: `${amount} ${metaData[0].name}`,
        amount: `$${(Number(amount) * Number(metaData[0].price)).toFixed(5)}`,
        avatarSrc: metaData[0].image,
      } as AccountInfoProps
    }),
  )

  const withdrawnBalances = await Promise.all(
    Object.keys(earnings.withdrawn!).map(async (key) => {
      const metaData = await fetchMetaData(provider, [key])
      const amount = Number(
        formatEther(BigNumber.from(earnings.withdrawn![key])),
      ).toFixed(3)
      withdrawnAmount += Number(amount) * Number(metaData[0].price)
      return {
        address: `${amount} ${metaData[0].name}`,
        amount: `$${(Number(amount) * Number(metaData[0].price)).toFixed(5)}`,
        avatarSrc: metaData[0].image,
      } as AccountInfoProps
    }),
  )

  const totalAmount = (activeAmount + withdrawnAmount).toFixed(2)
  return {
    activeAmount: activeAmount.toFixed(5),
    activeBalances,
    withdrawnAmount: withdrawnAmount.toFixed(5),
    withdrawnBalances,
    totalAmount,
  }
}

export { getSplitEarningsInfo, getUserEarningsInfo }
