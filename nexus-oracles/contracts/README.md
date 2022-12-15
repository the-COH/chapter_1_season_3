# Nexus Core

## Solutions

### Nexus RNG v1

Nexus is providing decentralized random number generation through a Commit-Reveal scheme while leveraging the distributed randomness beacon provided by [drand](https://drand.love).

The process of random number "generation"/revelation splits up requesters, miners, and random number providers, *pseudo-preventing* them from collaborating to tamper with results.

This gives a highly probably randomness due to the removal of miner intervention due to the drand network, and the commit-reveal data cycle.

The random keys generated through the distributed key generation process is put on-chain by Nexus nodes, that are making simple requests to nodes in the **drand** network.

On-chain smart contracts can then commit to a future *drand key*, and hence leverage a randomly, by-miner-unmalleable hash.

This is normally referred to as a *Commit-Reveal scheme*.

For attack vendors and security considerations, please refer to the drand docs, and keep in mind that the connection between the drand network and Canto is also prone to attacks due to the nature of oracle networks.

Uses:

- drand
- commit/reveal scheme
- Verifiable Delay Functions (VDFs)

## To Do

### v2

#### Nexus RNG v2

- Add subscription flow to automate the *reveal* step in the Commit-Reveal flow
  This allows for a more convenient UX, but requires upfront deposit of payment tokens.


## Roadmap

### Nexus RNG

#### Hackathon MVP

- Centralized, but flexible one-node setup

#### Beta

- RNG network with built-in staking/slashing of nodes, dispute resolution, and payment system
- Schelling point for reaching consensus

#### Production

- Audits
