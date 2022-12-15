import create from 'zustand'

interface DeployStore {
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
    amount: number
  }[]
  addFounderAddress: (index: number, address: string) => void
  addFounderAmount: (index: number, amount: number) => void
}

export const useDeployStore = create<DeployStore>((set) => ({
  name: '',
  setName: (name: string) => set({ name }),
  symbol: '',
  setSymbol: (symbol: string) => set({ symbol }),
  logo: null,
  setLogo: (logo: File) => set({ logo }),
  mission: '',
  setMission: (mission: string) => set({ mission }),
  founders: [
    {
      address: '',
      amount: 0,
    },
  ],
  addFounderAddress: (index: number, address: string) =>
    set((state) => {
      state.founders[index].address = address
      return state
    }),
  addFounderAmount: (index: number, amount: number) =>
    set((state) => {
      state.founders[index].amount = amount
      return state
    }),
}))
