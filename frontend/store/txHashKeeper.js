/* eslint-disable no-console */
import txStatus from './txStatus'

export const state = () => {
  return {
    netId1: {
      txs: {}
    },
    netId3: {
      txs: {}
    },
    netId4: {
      txs: {}
    },
    netId5: {
      txs: {}
    },
    netId42: {
      txs: {}
    },
    netId77: {
      txs: {}
    },
    netId99: {
      txs: {}
    }
  }
}

export const getters = {
  txExplorerUrl: (state, getters, rootState, rootGetters) => (txHash) => {
    const { explorerUrl } = rootGetters['metamask/networkConfig']
    return explorerUrl.tx + txHash
  },
  addressExplorerUrl: (state, getters, rootState, rootGetters) => (address) => {
    const { explorerUrl } = rootGetters['metamask/networkConfig']
    return explorerUrl.address + address
  },
  txs: (state, getters, rootState, rootGetters) => {
    const netId = rootGetters['metamask/netId']
    const a = Object.entries(state[`netId${netId}`].txs).map(
      ([txHash, { status, type, note, amount }]) => {
        return {
          txHash,
          status,
          type,
          note,
          amount
        }
      }
    )
    return a
  },
  txStatusClass: () => (status) => {
    let cssClass
    switch (status) {
      case txStatus.waitingForReciept:
        cssClass = 'is-loading'
        break
      case txStatus.success:
        cssClass = 'is-success'
        break
      case txStatus.fail:
        cssClass = 'is-danger'
        break
      default:
        break
    }
    return cssClass
  }
}

export const mutations = {
  SAVE_TX_HASH(state, { txHash, note = null, type, amount }) {
    const netId = this._vm['metamask/netId']
    this._vm.$set(state[`netId${netId}`].txs, [txHash], {
      status: txStatus.waitingForReciept,
      note,
      type,
      amount
    })
  },
  CHANGE_TX_STATUS(state, { txHash, status }) {
    const netId = this._vm['metamask/netId']
    this._vm.$set(state[`netId${netId}`].txs[txHash], 'status', status)
  },
  DELETE_TX(state, { txHash }) {
    const netId = this._vm['metamask/netId']
    this._vm.$delete(state[`netId${netId}`].txs, txHash)
  }
}

export const actions = {
  async runTxWatcher({ commit, dispatch }, { txHash, netId }) {
    let { status } = await dispatch('metamask/waitForTxReceipt', { txHash, netId }, { root: true })
    status = status ? txStatus.success : txStatus.fail
    commit('CHANGE_TX_STATUS', { txHash, status, netId })
    return status === txStatus.success
  }
}
