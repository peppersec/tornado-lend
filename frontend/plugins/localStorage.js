// ~/plugins/localStorage.js
import createPersistedState from 'vuex-persistedstate'

export default ({ store, isHMR }) => {
  window.onNuxtReady(() => {
    if (isHMR) return
    createPersistedState({
      key: 'wallet',
      paths: ['txHashKeeper']
    })(store)
  })
}
