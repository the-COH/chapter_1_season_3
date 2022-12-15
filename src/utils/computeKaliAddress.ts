import { contracts } from '~/constants'
import { ethers } from 'ethers'
import { CLONE_ABI } from '~/constants/abi/determineClone'

export const computeKaliAddress = (name: string) => {
  if (name === '') return
  const kaliMaster = contracts[7700]['kaliMaster']
  const factoryAddress = contracts[7700]['kaliFactory']
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const bytecodeHash = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ['bytes20', 'address', 'bytes15'],
      ['0x602c3d8160093d39f33d3d3d3d363d3d37363d73', kaliMaster, '0x5af43d82803e903d91602b57fd5bf3'],
    ),
  )
  const address = ethers.utils.getCreate2Address(factoryAddress, salt, bytecodeHash)

  return address
}

export const fetchKaliAddress = async (name: string) => {
  const salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
  const provider = new ethers.providers.JsonRpcProvider('https://canto.slingshot.finance/')
  const contract = new ethers.Contract(contracts[7700]['determineClone'], CLONE_ABI, provider)
  try {
    const address = await contract.predictDeterministicAddress(
      contracts[7700]['kaliMaster'],
      salt,
      contracts[7700]['kaliFactory'],
    )
    console.log(address)
    return address
  } catch (e) {
    console.log(e)
  }
}
