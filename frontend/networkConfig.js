const networkConfig = {
  netId1: {
    rpcCallRetryAttempt: 15,
    gasPrice: { fast: 21, low: 1, custom: 3, standard: 4 },
    currencyName: 'ETH',
    explorerUrl: {
      tx: 'https://etherscan.io/tx/',
      address: 'https://etherscan.io/address/'
    },
    networkName: 'mainnet',
    rpcUrl: 'https://ethereum-rpc.trustwalletapp.com',
    wallet: '0x249FbDA0D8Fd4bFCe57Ce9636a5951AF35Bc058F',
    dao: '0x2a80f877f4744dCFd1Ab7A9F84699702b16C26CF',
    pollInterval: 15,
    gasOracleUrls: [
      'https://www.etherchain.org/api/gasPriceOracle',
      'https://gasprice.poa.network/'
    ]
  },
  netId3: {
    rpcCallRetryAttempt: 15,
    gasPrice: { fast: 21, low: 3, custom: 5, standard: 10 },
    currencyName: 'rETH',
    explorerUrl: {
      tx: 'https://ropsten.etherscan.io/tx/',
      address: 'https://ropsten.etherscan.io/address/'
    },
    networkName: 'ropsten',
    rpcUrl: 'https://ropsten.infura.io/v3/c7463beadf2144e68646ff049917b716',
    wallet: '0x249FbDA0D8Fd4bFCe57Ce9636a5951AF35Bc058F',
    dao: '0x2a80f877f4744dCFd1Ab7A9F84699702b16C26CF',
    pollInterval: 4
  }
}

export default networkConfig
