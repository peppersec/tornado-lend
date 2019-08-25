let hasSourceMaps = '#source-map'
if (process.env.NODE_ENV !== 'development') {
  hasSourceMaps = false
}

const modifyHtml = (html) => {
  return html.replace(/data-n-head=""|data-n-head="true"/g, '')
}

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  generate: {
    concurrency: 1
  },
  hooks: {
    'generate:page': (page) => {
      page.html = modifyHtml(page.html)
    },
    'render:route': (url, page, { req, res }) => {
      page.html = modifyHtml(page.html)
    }
  },
  head: {
    title: 'Wallet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000403' },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: ''
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: ''
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: ''
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Lending'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'lending'
      }
    ],
    link: [
      { rel: 'manifest', href: 'manifest.json' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon/android-chrome-192x192.png' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=PT+Mono&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#94febf', height: '5px', duration: 5000 },
  /*
   ** Global CSS
   */
  css: ['@/assets/styles/app.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~plugins/localStorage', ssr: false }],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    [
      'nuxt-buefy',
      {
        css: false,
        materialDesignIcons: false
      }
    ],
    '@nuxtjs/eslint-module'
  ],

  router: {
    linkActiveClass: '',
    linkExactActiveClass: 'is-active'
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.devtool = hasSourceMaps
      }
      config.output.publicPath = './_nuxt/'
    },
    plugins: []
  }
}
