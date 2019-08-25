/* eslint-disable no-console */
import Web3 from 'web3'
import networkConfig from '@/networkConfig'

const { toHex, toWei, toChecksumAddress, hexToNumberString } = require('web3-utils')

const onAccountsChanged = ({ newAccount, commit }) => {
  const account = toChecksumAddress(newAccount[0])
  commit('IDENTIFY', account)
}

const web3Instance = (rpcUrl) => {
  const web3 = Object.freeze(new Web3(rpcUrl))
  return web3
}

const state = () => {
  return {
    ethAccount: null,
    netId: 1,
    ethBalance: '0',
    gasPrice: { fast: 21, low: 1, custom: 1, standard: 5 }
  }
}

const getters = {
  hasEthAccount(state) {
    return state.ethAccount !== null
  },
  netId(state) {
    return state.netId
  },
  networkName(state) {
    return networkConfig[`netId${state.netId}`].networkName
  },
  currency(state) {
    return networkConfig[`netId${state.netId}`].currencyName
  },
  networkConfig(state) {
    const conf = networkConfig[`netId${state.netId}`]
    if (!conf) {
      return {
        networkName: '',
        'eth-1': '',
        'eth-0.1': '',
        explorerUrl: {},
        currencyName: 'ETH',
        pollInterval: 15,
        deployedBlock: 0,
        gasPrice: { fast: 2, low: 1, custom: 1, standard: 4 }
      }
    }
    return conf
  },
  web3: (state, getters) => {
    const { rpcUrl } = getters.networkConfig
    return web3Instance(rpcUrl)
  },
  web3Ethereum: (state, getters) => () => {
    return window.ethereum
  },
  injectedProvider: (state, getters) => {
    return window.web3.currentProvider
  },
  gasPrice: (state) => {
    return toHex(toWei(state.gasPrice.custom.toString(), 'gwei'))
  },
  fastGasPrice: (state) => {
    return toHex(toWei(state.gasPrice.fast.toString(), 'gwei'))
  },
  lowGasPrice: (state) => {
    return toHex(toWei(state.gasPrice.standard.toString(), 'gwei'))
  }
}

const mutations = {
  IDENTIFY(state, ethAccount) {
    state.ethAccount = ethAccount
  },
  SET_NET_ID(state, netId) {
    netId = parseInt(netId, 10)
    state.netId = netId
  },
  SAVE_BALANCE(state, ethBalance) {
    state.ethBalance = ethBalance
  },
  SAVE_GAS_PRICE(state, gasPrice) {
    state.gasPrice = gasPrice
  },
  CUSTOM_GAS_PRICE(state, gasPrice) {
    state.gasPrice.custom = gasPrice
  },
  SET_LIST_OF_TOKENS(state, tokensList) {
    state.tokensList = tokensList
  }
}

const actions = {
  onNetworkChanged({ commit }, { netId }) {
    commit('SET_NET_ID', netId)
  },
  getBalance({ dispatch, state, getters }, account) {
    const { rpcCallRetryAttempt } = getters.networkConfig
    return new Promise((resolve, reject) => {
      const checkBalance = async ({ retryAttempt = 1, account }) => {
        retryAttempt++
        try {
          const methodCallParams = {
            method: 'eth_getBalance',
            params: [account || state.ethAccount, 'latest']
          }

          const balance = await dispatch('metamask/sendAsync', methodCallParams, { root: true })
          resolve(balance)
        } catch (e) {
          if (retryAttempt >= rpcCallRetryAttempt) {
            reject(e)
          } else {
            checkBalance({ retryAttempt, account })
          }
        }
      }
      checkBalance({ account })
    })
  },
  askPermission({ commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        const ethereum = window.ethereum
        try {
          const ethAccounts = await ethereum.enable()
          if (ethAccounts.length === 0) {
            reject(new Error('lockedMetamask'))
          }
          const account = toChecksumAddress(ethAccounts[0])
          commit('IDENTIFY', account)
          let balance = await dispatch('getBalance')
          balance = hexToNumberString(balance)
          dispatch('saveUserBalance', { balance })
          const netId = await dispatch('sendAsync', {
            method: 'net_version',
            params: [],
            callbackAction: 'metamask/onNetworkChanged'
          })
          dispatch('onNetworkChanged', { netId })
          if (ethereum.on) {
            ethereum.on('accountsChanged', (newAccount) =>
              onAccountsChanged({ dispatch, commit, newAccount })
            )
            ethereum.on('networkChanged', (netId) => dispatch('onNetworkChanged', { netId }))
          }
          resolve({ netId, ethAccount: ethAccounts[0] })
        } catch (error) {
          // User rejects approval from metamask
          reject(error)
        }
      } else {
        reject(new Error('noMetamask'))
      }
    })
  },

  saveUserBalance({ commit }, { balance }) {
    commit('SAVE_BALANCE', balance)
  },

  sendAsync({ getters }, { method, from, params }) {
    console.log('sendAsync, method, from, params', method, from, params)
    switch (getters.netId) {
      case 77:
      case 99:
      case 100:
        from = undefined
        break
    }
    return new Promise((resolve, reject) => {
      getters.web3Ethereum().sendAsync(
        {
          method,
          params,
          jsonrpc: '2.0',
          from
        },
        (err, response) => {
          if (err) {
            reject(err)
          }
          if (response.error) {
            reject(response.error)
          } else {
            resolve(response.result)
          }
        }
      )
    })
  },
  waitForTxReceipt({ dispatch, getters, state }, { txHash, netId }) {
    if (!netId) {
      netId = state.netId
    }
    const { rpcCallRetryAttempt, rpcUrl } = networkConfig[`netId${netId}`]
    return new Promise((resolve, reject) => {
      const checkForTx = async ({ txHash, retryAttempt = 0 }) => {
        const result = await web3Instance(rpcUrl).eth.getTransactionReceipt(txHash)
        if (!result || !result.blockNumber) {
          if (retryAttempt <= rpcCallRetryAttempt * 10) {
            retryAttempt++
            setTimeout(() => {
              checkForTx({ txHash, retryAttempt })
            }, 1000 * retryAttempt)
          } else {
            reject(new Error('tx not minted'))
          }
        } else {
          // callback with success
          resolve(result)
        }
      }
      checkForTx({ txHash })
    })
  },
  callWeb3({ state, getters }, { data, to, web3Method, from, gas = 7500000, value = 0 }) {
    const { rpcCallRetryAttempt } = getters.networkConfig
    return new Promise((resolve, reject) => {
      const checkForTx = async ({ data, retryAttempt = 0, to }) => {
        try {
          const { ethAccount } = state
          const result = await getters.web3.eth[web3Method]({
            data,
            to,
            from: from || ethAccount,
            gas,
            value
          })
          return resolve(result)
        } catch (e) {
          const message = e.message.match(/"message":"(.*)"/)[1]
          if (
            message === 'The execution failed due to an exception.' ||
            message === 'VM execution error.'
          ) {
            return reject(new Error(message))
          }
          if (retryAttempt <= rpcCallRetryAttempt) {
            console.error('callWeb3.checkForTx', e.message)
            retryAttempt++
            setTimeout(() => {
              checkForTx({ data, retryAttempt, to })
            }, 1000 * retryAttempt)
          } else {
            return reject(new Error('rpc failed'))
          }
        }
      }
      checkForTx({ data, to })
    })
  },
  async fetchGasPrice({ rootState, commit, dispatch, rootGetters, state }, { oracleIndex = 0 }) {
    // eslint-disable-next-line prettier/prettier
    const { pollInterval, gasPrice, gasOracleUrls } = rootGetters['metamask/networkConfig']
    const { netId } = rootState.metamask
    try {
      if (netId === 1) {
        const response = await fetch(gasOracleUrls[oracleIndex % gasOracleUrls.length])
        if (response.status === 200) {
          const json = await response.json()

          const gasPrices = { ...gasPrice }
          if (json.slow) {
            gasPrices.low = Number(json.slow) + 0.5
          }
          if (json.safeLow) {
            gasPrices.low = Number(json.safeLow) + 0.5
          }
          if (json.standard) {
            gasPrices.standard = Number(json.standard)
          }
          if (json.fast) {
            gasPrices.fast = Number(json.fast) + 5
          }
          gasPrices.custom = state.gasPrice.custom
          commit('SAVE_GAS_PRICE', gasPrices)
        } else {
          throw Error('Fetch gasPrice failed')
        }
        setTimeout(() => dispatch('fetchGasPrice', {}), 1000 * pollInterval)
      } else {
        commit('SAVE_GAS_PRICE', gasPrice)
      }
    } catch (e) {
      console.error(e)
      oracleIndex++
      setTimeout(() => dispatch('fetchGasPrice', { oracleIndex }), 1000 * pollInterval)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
