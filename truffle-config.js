
const { toWei } = require('web3-utils');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');
const utils = require('web3-utils');

module.exports = {

  networks: {
    test: {
      host: 'localhost',
      port: 8545,
      network_id: '3',
      gasPrice: toWei('1', 'gwei'),
      websockets: false,
      gas: 6700000,
    },

    ropsten: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, 'https://ropsten.infura.io/v3/c7463beadf2144e68646ff049917b716'),
      network_id: '*',
      gas: 7000000,
      gasPrice: utils.toWei('10', 'gwei'),
      // confirmations: 0,
      // timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.11",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
      //  evmVersion: "byzantium"
      }
    }
  }
}
