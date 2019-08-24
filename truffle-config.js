
const { toWei } = require('web3-utils');

module.exports = {

  networks: {
    test: {
      host: 'localhost',
      port: 8545,
      network_id: '333',
      gasPrice: toWei('1', 'gwei'),
      websockets: false,
      gas: 6700000,
    },
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
