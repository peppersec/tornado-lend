<template>
  <footer class="footer">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item is-column">
            <div class="level-subitem footer-address">
              <div class="footer-address__name">
                Made with ❤️ by <a href="https://peppersec.com">PepperSec.com</a>
              </div>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item is-column">
            <div class="level-subitem footer-address">
              <div class="footer-address__name">
                Wallet (Ethereum {{ networkConfig.networkName }}):
              </div>
              <a
                class="footer-address__value"
                target="_blank"
                :href="addressExplorerUrl(networkConfig.wallet)"
              >
                {{ networkConfig.wallet }}
              </a>
            </div>
            <div class="level-subitem footer-address">
              <div class="footer-address__name">
                DAO:
              </div>
              <a
                class="footer-address__value"
                target="_blank"
                :href="addressExplorerUrl(networkConfig.dao)"
              >
                {{ networkConfig.dao }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState('mixer', ['ip']),
    ...mapGetters('metamask', ['networkConfig']),
    ...mapGetters('txHashKeeper', ['addressExplorerUrl'])
  },
  methods: {
    ipInfoToRender(ip) {
      if (ip.ip) {
        return `${ip.ip}, ${ip.city}, ${ip.country}`
      } else {
        return 'Loading ...'
      }
    }
  }
}
</script>
