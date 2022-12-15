export const CLONE_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'implementation', type: 'address' }],
    name: 'initCodeHash',
    outputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'address', name: 'deployer', type: 'address' },
    ],
    name: 'predictDeterministicAddress',
    outputs: [{ internalType: 'address', name: 'predicted', type: 'address' }],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
