const { task } = require('hardhat/config')

const { MerkleTree } = require('merkletreejs')
const { keccak256 } = require('ethers/lib/utils')

require('dotenv').config()
require('@nomiclabs/hardhat-etherscan')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
require('hardhat-gas-reporter')
require('solidity-coverage')
require("@nomiclabs/hardhat-ethers");

const WHITELIST = require('./data/whitelist.json')

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task('merkle-proof', 'Create merkle proof')
  .addParam('account', 'The account address')
  .setAction(async ({account}) => {
    const whitelist = WHITELIST.list
    const leaf = whitelist.map((addr) => keccak256(addr))
    const merkleTree = new MerkleTree(leaf, keccak256, {sortPairs: true})

    const proof = keccak256(account)

    console.log(proof)
    console.log('whitelist', whitelist)
    console.log('proof :', merkleTree.getHexProof(proof))
  })

  task('merkle-whitelist', 'Create whitelist', async () => {
    const whitelist = WHITELIST.list
    const leaf = whitelist.map((addr) => keccak256(addr))
    const merkleTree = new MerkleTree(leaf, keccak256, { sortPairs: true })
    const rootHash = merkleTree.getRoot()
    console.log(rootHash)
    console.log(merkleTree.getHexRoot())
  })

  module.exports = {
    solidity: {
      version: '0.8.21',
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000,
        },
      },
    },
  }