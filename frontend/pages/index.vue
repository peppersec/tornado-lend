<template>
  <div>
    <div class="columns">
      <div class="column is-half">
        <b-tabs v-model="activeTab" :animated="false">
          <b-tab-item label="Wallet">
            <b-button type="is-primary is-fullwidth" @click="onWalletDeposit"
              >Deposit 0.1 {{ networkConfig.currencyName }}</b-button
            >
            <hr />
            <b-button type="is-primary is-fullwidth" @click="onWalletWithdraw"
              >Withdraw 0.1 {{ networkConfig.currencyName }}</b-button
            >
          </b-tab-item>
          <b-tab-item label="DAO">
            <div class="label">{{ networkConfig.currencyName }} amount</div>
            <b-input v-model="daoDepositAmount" type="number"></b-input>
            <br />
            <b-button type="is-primary is-fullwidth" @click="onBuyShare">Buy share</b-button>
            <hr />
            <b-button type="is-primary is-fullwidth" @click="onWithdrawShare"
              >Withdraw share</b-button
            >
            <hr />
            <b-button type="is-primary is-fullwidth" @click="onMoveInterest"
              >Move interest</b-button
            >
          </b-tab-item>
        </b-tabs>
      </div>
      <div class="column is-half">
        <div class="box box-stats">
          <div class="title">Data</div>
          <div class="columns is-multiline">
            <div class="column is-half-small is-12-tablet is-half-desktop">
              <div class="subtitle">
                Total amount
              </div>
              <ul>
                <li>
                  <span class="value">{{ walletBalance }} {{ networkConfig.currencyName }}</span>
                </li>
              </ul>
            </div>
            <div class="column is-half-small is-12-tablet is-half-desktop">
              <div class="subtitle">
                DAO Earnings
              </div>
              <ul>
                <li>
                  <span class="value">{{ walletInterest }} {{ networkConfig.currencyName }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="columns is-multiline">
            <div class="column">
              <div class="subtitle">Shares</div>
              <ul>
                <li>
                  <span class="value">You</span>
                  <span class="sep">-</span>
                  <span class="data">{{ sharePercent }}%</span>
                  <span class="sep">-</span>
                  <span class="data">{{ daoEthValue }} {{ networkConfig.currencyName }}</span>
                </li>
                <li>
                  <span class="value">User2</span>
                  <span class="sep">-</span>
                  <span class="data">90%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="txs">
      <div class="columns is-multiline">
        <Tx v-for="(tx, index) in txs" :key="tx.txHash" :tx="tx" :index="index" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'

import Tx from '@/components/Tx'

/* eslint-disable no-console */
export default {
  name: 'HomePage',
  components: {
    Tx
  },
  data() {
    return {
      activeTab: 0,
      daoDepositAmount: 0
    }
  },
  computed: {
    ...mapGetters('txHashKeeper', ['txs', 'txExplorerUrl']),
    ...mapGetters('metamask', ['networkConfig', 'hasEthAccount', 'netId']),
    ...mapGetters('wallet', ['walletBalance', 'walletInterest']),
    ...mapState('dao', ['sharePercent', 'daoEthValue'])
  },
  mounted() {
    if (this.$route.query.note) {
      this.activeTab = 1
    }
  },
  methods: {
    async onWalletDeposit() {
      await this.$store.dispatch('wallet/deposit', {})
    },
    async onWalletWithdraw() {
      await this.$store.dispatch('wallet/withdraw', {})
    },
    async onMoveInterest() {
      console.log('onMoveInterest')
      await this.$store.dispatch('wallet/withdrawInterest', {})
    },
    async onWithdrawShare() {
      console.log('onWithdrawShare')
      await this.$store.dispatch('dao/withdrawShare', {})
    },
    async onBuyShare() {
      console.log('onBuyShare', this.daoDepositAmount)
      await this.$store.dispatch('dao/buy', { amount: this.daoDepositAmount })
    }
  }
}
</script>
