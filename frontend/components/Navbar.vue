<template>
  <nav class="navbar header" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link to="/" active-class="" class="navbar-item">
          Wallet powered by
          <a class="compound" href="https://compound.finance/" target="_blank"
            >Compound.finance <Logo
          /></a>
        </nuxt-link>

        <div
          class="navbar-burger burger"
          :class="{ 'is-active': isMenuActive }"
          @click="isMenuActive = !isMenuActive"
        >
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons buttons__social">
              <a href="https://github.com/peppersec/lendingLibrary" target="_blank" class="button">
                <span class="icon icon-github"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from '@/components/Logo'

export default {
  components: {
    Logo
  },
  data() {
    return {
      isMenuActive: false
    }
  },
  computed: {
    ...mapGetters('metamask', ['networkConfig', 'hasEthAccount', 'netId'])
  },
  watch: {
    $route: 'closeMenu'
  },
  methods: {
    closeMenu() {
      this.isMenuActive = false
    }
  }
}
</script>
