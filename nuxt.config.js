// register env before other imports @see https://www.npmjs.com/package/dotenv#how-do-i-use-dotenv-with-import-
import 'dotenv/config';
import dotenv from 'dotenv';

const envConfig = dotenv.config();
import {BASE_TITLE, BASE_DESCRIPTION} from "./assets/variables";


export default {
    /*
    ** Headers of the page
    */
    head: {
        title: BASE_TITLE,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: BASE_DESCRIPTION },
            { hid: 'og-title', name: 'og:title', content: BASE_TITLE },
            { hid: 'og-description', name: 'og:description', content: BASE_DESCRIPTION },
            { hid: 'og-image', name: 'og:image', content: '/social-share.png' },
        ],
        link: [
            { rel: 'icon', href: '/favicon.png' },
            { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        ],
    },
    css: [
        './static/css/style.min.css',
    ],
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#d35c12' },
    router: {
        linkActiveClass: '',
        linkExactActiveClass: 'is-active',
        middleware: [
            // 'profile',
            // 'auth',
        ],
    },
    plugins: [
        { src: '~/plugins/persistedState.js', ssr: false },
        { src: '~/plugins/click-blur.js', ssr: false },
        { src: '~/plugins/price.js', ssr: false },
        { src: '~/plugins/seo-ym.js', ssr: false },
    ],
    env: envConfig.error ? {} : envConfig.parsed,
    modules: [

    ],
    /*
    ** Build configuration
    */
    build: {
        extractCSS: true,
        // optimization: {
        //     splitChunks: {
        //         name: true
        //     }
        // },
        watch: [
            './api/',
            // `./lang/`, // this watcher dont-work yet
        ],
        /*
        ** Run ESLint on save
        */
        // extend(config, { isDev, isClient, isServer }) {
        //     // if (isDev && isClient) {
        //     //     config.module.rules.push({
        //     //         enforce: 'pre',
        //     //         test: /\.(js|vue)$/,
        //     //         loader: 'eslint-loader',
        //     //         exclude: /(node_modules)/,
        //     //     });
        //     // }
        // },
        babel: {
            presets: [
                [
                    '@nuxt/babel-preset-app',
                    {
                        // targets: isServer ? { node: '10' } : { ie: '11' },
                        corejs: { version: 3 },
                    },
                ],
            ],
            // prevent @babel/plugin-transform-runtime from inserting `import` statement into commonjs files (bc. it breaks webpack)
            sourceType: 'unambiguous',
        },
        transpile: [
            /es6-promise|\.(?!(?:js|json)$).{1,5}$/i,
            '/base-x/',
            '@material/',
            'date-fns/esm',
            'lodash-es',
            'nuxt-i18n/src',
            'qr-scanner',
            'v-autosize/src',
            'v-file-input/src',
            'vue-inline-svg/src/',
            'clipbrd/src',
            'pretty-num/src',
            'from-exponential/src',
            'minterjs-util',
            'minterjs-tx',
            'minterjs-wallet',
            'minter-js-sdk',
            'minter-js-org',
        ],
    },
};
