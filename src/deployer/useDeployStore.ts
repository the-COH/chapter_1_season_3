import create from 'zustand'
import { computeKaliAddress, fetchKaliAddress } from '~/utils/computeKaliAddress'

interface DeployStore {
  dao_address: string
  setDaoAddress: (name: string) => void
  name: string
  setName: (name: string) => void
  symbol: string
  setSymbol: (symbol: string) => void
  logo: File | null
  setLogo: (logo: File) => void
  mission: string
  setMission: (mission: string) => void
  founders: {
    address: string
    amount: string
  }[]
  addFounder: () => void
  deleteFounder: (index: number) => void
  addFounderAddress: (index: number, address: string) => void
  addFounderAmount: (index: number, amount: string) => void
}

export const useDeployStore = create<DeployStore>((set) => ({
  dao_address: '',
  setDaoAddress: async (name: string) => {
    const address = await fetchKaliAddress(name)
    set({ dao_address: address })
  },
  name: '',
  setName: (name: string) => {
    set({ name })
  },
  symbol: '',
  setSymbol: (symbol: string) => set({ symbol }),
  logo: null,
  setLogo: (logo: File) => set({ logo }),
  mission: '',
  setMission: (mission: string) => set({ mission }),
  founders: [
    {
      address: '',
      amount: '0',
    },
  ],
  addFounder: () => {
    set((state) => {
      state.founders.push({
        address: '',
        amount: '1000',
      })
      return state
    })
  },
  deleteFounder: (index: number) => {
    set((state) => {
      state.founders.splice(index, 1)
      return state
    })
  },
  addFounderAddress: (index: number, address: string) =>
    set((state) => {
      state.founders[index].address = address
      return state
    }),
  addFounderAmount: (index: number, amount: string) =>
    set((state) => {
      state.founders[index].amount = amount
      return state
    }),
}))
