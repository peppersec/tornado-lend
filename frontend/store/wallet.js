/* eslint-disable no-console */
import { toWei, numberToHex, fromWei } from 'web3-utils'
import WalletABI from '../abis/Wallet.abi.json'

export const state = () => {
  return {
    balance: '0',
    interest: '0'
  }
}

export const getters = {
  walletInstance: (state, getters, rootState, rootGetters) => {
    const web3 = rootGetters['metamask/web3']
    const { wallet } = rootGetters['metamask/networkConfig']
    return new web3.eth.Contract(WalletABI, wallet)
  },
  walletBalance: (state, getters, rootState, rootGetters) => {
    return fromWei(state.balance)
  },
  walletInterest: (state, getters, rootState, rootGetters) => {
    return fromWei(state.interest).slice(0, 13)
  }
}

export const mutations = {
  SAVE_WALLET_BALANCE(state, { balance }) {
    state.balance = balance
  },
  SAVE_WALLET_INTEREST(state, { interest }) {
    state.interest = interest
  }
}

export const actions = {
  async deposit({ commit, dispatch, getters, rootState, rootGetters }) {
    const { walletInstance } = getters
    const gasPrice = rootGetters['metamask/gasPrice']
    const { ethAccount } = rootState.metamask
    const data = walletInstance.methods.enter().encodeABI()
    const gas = await walletInstance.methods
      .enter()
      .estimateGas({ from: ethAccount, value: numberToHex(toWei('0.1')) })
    const callParams = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: ethAccount,
          to: walletInstance.address,
          gas: numberToHex(gas + 10000),
          gasPrice,
          value: numberToHex(toWei('0.1')),
          data
        }
      ],
      from: ethAccount
    }
    const txHash = await dispatch('metamask/sendAsync', callParams, {
      root: true
    })
    commit(
      'txHashKeeper/SAVE_TX_HASH',
      { txHash, type: 'Deposit', amount: toWei('0.1') },
      { root: true }
    )
    dispatch('txHashKeeper/runTxWatcher', { txHash }, { root: true })
  },
  async withdraw({ commit, dispatch, getters, rootState, rootGetters }) {
    const { walletInstance } = getters
    const gasPrice = rootGetters['metamask/gasPrice']
    const { ethAccount } = rootState.metamask
    const data = walletInstance.methods.exit().encodeABI()
    const gas = await walletInstance.methods.exit().estimateGas({ from: ethAccount })
    const callParams = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: ethAccount,
          to: walletInstance.address,
          gas: numberToHex(gas + 10000),
          gasPrice,
          value: numberToHex(0),
          data
        }
      ],
      from: ethAccount
    }
    const txHash = await dispatch('metamask/sendAsync', callParams, {
      root: true
    })
    commit(
      'txHashKeeper/SAVE_TX_HASH',
      { txHash, type: 'Withdraw', amount: toWei('0.1') },
      { root: true }
    )
    dispatch('txHashKeeper/runTxWatcher', { txHash }, { root: true })
  },
  async getStatistic({ commit, dispatch, getters, rootState, rootGetters }) {
    const { walletInstance } = getters
    const balance = await walletInstance.methods.lendedAmount().call()
    commit('SAVE_WALLET_BALANCE', { balance: balance.toString() })

    const interest = await walletInstance.methods.interest().call()
    commit('SAVE_WALLET_INTEREST', { interest: interest.toString() })
  },
  async withdrawInterest({ commit, dispatch, getters, rootState, rootGetters }) {
    const { walletInstance } = getters
    const gasPrice = rootGetters['metamask/gasPrice']
    const { ethAccount } = rootState.metamask
    const data = walletInstance.methods.withdrawInterest().encodeABI()
    const gas = await walletInstance.methods.withdrawInterest().estimateGas({ from: ethAccount })
    const callParams = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: ethAccount,
          to: walletInstance.address,
          gas: numberToHex(gas + 10000),
          gasPrice,
          value: numberToHex(0),
          data
        }
      ],
      from: ethAccount
    }
    const txHash = await dispatch('metamask/sendAsync', callParams, {
      root: true
    })
    commit(
      'txHashKeeper/SAVE_TX_HASH',
      { txHash, type: 'Withdraw', amount: toWei('0.1') },
      { root: true }
    )
    dispatch('txHashKeeper/runTxWatcher', { txHash }, { root: true })
  }
}
