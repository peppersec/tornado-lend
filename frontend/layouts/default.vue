<template>
  <div class="wrapper">
    <Navbar />
    <section class="main-content section">
      <div class="container">
        <nuxt />
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
/* eslint-disable no-console */
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import networkConfig from '@/networkConfig'

export default {
  components: {
    Navbar,
    Footer
  },
  mounted() {
    // this.$preventMultitabs()
    if (process.browser) {
      window.onNuxtReady(() => {
        setTimeout(async () => {
          // eslint-disable-next-line no-console
          console.log('run!')
          let netId
          try {
            ;({ netId } = await this.$store.dispatch('metamask/askPermission'))
            console.log('netId', netId)
            if (!networkConfig[`netId${netId}`]) {
              throw new Error('Current network is not supported. Try Ropsten')
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            if (!netId) {
              this.$snackbar.open({
                message: 'Please install Metamask or TrustWallet if you going to deposit',
                type: 'is-warning',
                position: 'is-top',
                actionText: 'Install',
                duration: 10000,
                onAction: () => {
                  window.open('https://metamask.io', '_blank')
                }
              })
            } else {
              this.$snackbar.open({
                message: e.message,
                type: 'is-warning',
                position: 'is-top',
                indefinite: true
              })
            }
          }
          this.$store.dispatch('metamask/fetchGasPrice', {})
          this.$store.dispatch('dao/getStatistic', {})
          this.$store.dispatch('wallet/getStatistic', {})
        }, 500)
      })
    }
  }
}
</script>
