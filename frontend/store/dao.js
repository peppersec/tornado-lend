/* eslint-disable no-console */
import { toWei, numberToHex, toBN, fromWei, toChecksumAddress } from 'web3-utils'
import daoABI from '../abis/DAO.abi.json'

export const state = () => {
  return {
    sharePercent: '0',
    daoEthValue: '0',
    hodlers: [],
    totalSupply: '1'
  }
}

export const getters = {
  daoInstance: (state, getters, rootState, rootGetters) => {
    const web3 = rootGetters['metamask/web3']
    const { dao } = rootGetters['metamask/networkConfig']
    return new web3.eth.Contract(daoABI, dao)
  },
  hodlersToRender: (state, getters, rootState, rootGetters) => {
    return state.hodlers.map((hodler) => {
      return {
        address: hodler.to,
        share: toBN(hodler.value)
          .mul(toBN('100'))
          .div(toBN(state.totalSupply)),
        my: rootState.metamask.ethAccount === toChecksumAddress(hodler.to)
      }
    })
  }
}

export const mutations = {
  SAVE_SHARE(state, { share }) {
    state.sharePercent = share
  },
  SAVE_ETH_VALUE(state, { daoEthValue }) {
    state.daoEthValue = daoEthValue
  },
  SAVE_HODLERS(state, { hodlers }) {
    state.hodlers = hodlers
  },
  SAVE_TOTAL_SUPPLY(state, { totalSupply }) {
    state.totalSupply = totalSupply
  }
}

export const actions = {
  async buy({ commit, dispatch, getters, rootState, rootGetters }, { amount }) {
    const { daoInstance } = getters
    const gasPrice = rootGetters['metamask/gasPrice']
    const { ethAccount } = rootState.metamask
    const data = daoInstance.methods.deposit().encodeABI()
    const gas = await daoInstance.methods
      .deposit()
      .estimateGas({ from: ethAccount, value: numberToHex(toWei(amount.toString())) })
    const callParams = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: ethAccount,
          to: daoInstance.address,
          gas: numberToHex(gas + 10000),
          gasPrice,
          value: numberToHex(toWei(amount.toString())),
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
  async withdrawShare({ commit, dispatch, getters, rootState, rootGetters }) {
    const { daoInstance } = getters
    const gasPrice = rootGetters['metamask/gasPrice']
    const { ethAccount } = rootState.metamask
    const data = daoInstance.methods.withdrawAll().encodeABI()
    const gas = await daoInstance.methods.withdrawAll().estimateGas({ from: ethAccount })
    const callParams = {
      method: 'eth_sendTransaction',
      params: [
        {
          from: ethAccount,
          to: daoInstance.address,
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
    const { daoInstance } = getters
    const { ethAccount } = rootState.metamask
    const shares = toBN(await daoInstance.methods.balanceOf(ethAccount).call())
    console.log('shares', shares.toString())
    const totalSupply = toBN(await daoInstance.methods.totalSupply().call())
    console.log('totalSupply', totalSupply.toString())
    commit('SAVE_TOTAL_SUPPLY', { totalSupply: totalSupply.toString() })
    commit('SAVE_SHARE', { share: shares.mul(toBN('100')).div(totalSupply) })
    const amount = await daoInstance.methods.amountFromShares(shares.toString()).call()
    console.log('data', amount.toString())
    commit('SAVE_ETH_VALUE', { daoEthValue: fromWei(amount.toString()) })

    const graph = await fetch('https://api.thegraph.com/subgraphs/name/pertsev/tornadolend', {
      credentials: 'omit',
      headers: { 'content-type': 'application/json', 'sec-fetch-mode': 'cors' },
      referrer: 'https://thegraph.com/explorer/subgraph/pertsev/tornadolend?selected=playground',
      referrerPolicy: 'no-referrer-when-downgrade',
      body:
        '{"query":"{\\n  transfers(first: 5) {\\n    id\\n    from\\n    to\\n    value\\n  }\\n}\\n","variables":null}',
      method: 'POST',
      mode: 'cors'
    })
    const hodlers = (await graph.json()).data.transfers

    commit('SAVE_HODLERS', { hodlers })
    console.log('hodlers', hodlers)
  }
}
