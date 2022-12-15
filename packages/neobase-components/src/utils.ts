import { ethers } from 'ethers'
import React from 'react'

export interface EnsData {
  address: string
  name: string
  avatar: string
}

export const resolve = async (provider: any, address: string) => {
  if (address && provider && ethers.utils.isAddress(address)) {
    try {
      const ensName = await provider.lookupAddress(address)
      if (ensName !== null) {
        const avatar = await provider.getAvatar(ensName)

        return {
          address,
          name: ensName,
          avatar,
        } as EnsData
      } else {
        return undefined
      }
    } catch (err) {
      // console.log(err)
    }
  }
}
