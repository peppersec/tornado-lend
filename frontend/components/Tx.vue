<template>
  <div class="column is-half">
    <div class="box box-tx">
      <div class="tx-header">
        <div class="tx-title" :class="{ 'is-loading': tx.status === 1 }">
          Tx# {{ index + 1 }} {{ tx.type }}
        </div>
        <button class="button is-primary has-icon" @click="onClose">
          <span class="icon icon-close"></span>
        </button>
      </div>
      <div class="details">
        <p class="detail">
          <span class="detail-label">Amount</span>
          <span class="detail-description">{{ amount }} {{ networkConfig.currencyName }}</span>
        </p>
        <p class="detail">
          <span class="detail-label">Tx hash</span>
          <a class="detail-description" :href="txExplorerUrl(tx.txHash)" target="_blank">
            {{ tx.txHash }}
          </a>
        </p>
        <p v-if="tx.note" class="detail">
          <span class="detail-label">Note</span>
          <span class="detail-description">
            ••••••••••••••••••••••••••••
          </span>
          <b-tooltip :label="tooltipCopy" position="is-left">
            <button
              v-clipboard:copy="`${tx.prefix}-${tx.note}`"
              v-clipboard:success="onCopy"
              class="button is-primary has-icon"
            >
              <span class="icon icon-copy"></span>
            </button>
          </b-tooltip>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const { fromWei } = require('web3-utils')
export default {
  props: {
    tx: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tooltipCopy: 'Click to copy',
      tooltipShareUrl: 'Share Link'
    }
  },
  computed: {
    ...mapGetters('txHashKeeper', ['txExplorerUrl']),
    ...mapGetters('metamask', ['networkConfig']),
    amount() {
      return fromWei(this.tx.amount)
    }
  },
  methods: {
    onCopy() {
      this.tooltipCopy = 'Copied!'
      setTimeout(() => {
        this.tooltipCopy = 'Click to copy'
      }, 1500)
    },
    onCopyLink() {
      this.tooltipShareUrl = 'Copied!'
      setTimeout(() => {
        this.tooltipShareUrl = 'Share Link'
      }, 1500)
    },
    onClose() {
      this.$store.commit('txHashKeeper/DELETE_TX', { txHash: this.tx.txHash })
    }
  }
}
</script>
