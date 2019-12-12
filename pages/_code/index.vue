<script>
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    // import minLength from 'vuelidate/lib/validators/minLength';
    // import maxLength from 'vuelidate/lib/validators/maxLength';
    import sameAs from 'vuelidate/lib/validators/sameAs';
    import QrcodeVue from 'qrcode.vue';
    import {getServerValidator, fillServerErrors, getErrorText} from "~/assets/server-error";
    import {getTransfer} from '~/api';
    import {pretty} from '~/assets/utils';
    import ButtonCopy from '~/components/common/ButtonCopy.vue';
    import Lead from '~/components/Lead';

    export default {
        components: {
            QrcodeVue,
            ButtonCopy,
            Lead,
        },
        mixins: [validationMixin],
        filters: {
            pretty,
        },
        asyncData({params}) {
            return getTransfer(params.code)
                .then((transfer) => {
                    return {
                        transfer,
                    };
                });
        },
        head() {
            // const title = getTitle(this.$store.state.sectionName, this.$i18n.locale);
            // const description = this.tt('Get paid in crypto for your digital goods and services', 'index.seo-description');
            // const localeSuffix = this.$i18n.locale === 'en' ? '' : '-' + this.$i18n.locale;

            return {
                // title: title,
                meta: [
                    // { hid: 'og-title', name: 'og:title', content: title },
                    // { hid: 'description', name: 'description', content: description },
                    // { hid: 'og-description', name: 'og:description', content: description },
                    // { hid: 'og-image', name: 'og:image', content: `/img/social-share-wallet${localeSuffix}.png` },
                ],
            };
        },
        data() {
            return {
                /** @type Transfer */
                transfer: {},
                isPasswordActive: false,

                isFormSending: false,
                serverError: '',
                form: {
                    password: '',
                    passwordConfirm: '',
                },
                sve: {
                    password: {invalid: false, isActual: false, message: ''},
                },
            };
        },
        validations: {
            form: {
                password: {
                    required,
                    // minLength: minLength(PASSWORD_MIN_LENGTH),
                    // maxLength: maxLength(PASSWORD_MAX_LENGTH),
                    server: getServerValidator('password'),
                },
                passwordConfirm: {
                    required,
                    sameAsPassword: sameAs('password'),
                },
            },
        },
        computed: {
            isStatusDone() {
                return this.transfer.status === 'done';
            },
            receiveLink() {
                return `/${this.$route.params.code}/receive`;
            },
            walletLink() {
                return `/${this.$route.params.code}/seed`;
            },
        },
        methods: {

        }


    };
</script>

<template>
    <div>
        <Lead type="receive"/>

        <div class="transfer u-container" v-if="!isStatusDone">
            <h2 class="u-h1">
                {{ transfer.value | pretty }} BIP
                <span class="transfer__value-usd u-h2">≈{{ $store.getters.getUsdPrice(transfer.value) | pretty }} USD</span>
            </h2>

            <div class="transfer__receive-submit">
                <div class="button-group">
                    <nuxt-link class="button button--main" :to="receiveLink">Monke to my Wallet</nuxt-link>
                    <nuxt-link class="link--default u-fw-700" :to="walletLink">If you have no BIP Wallet <br> create it here</nuxt-link>
                </div>
            </div>
        </div>

        <div class="transfer u-container" v-else>
            <h2 class="transfer__success-title u-h1">Monke Sent!</h2>
            <div class="u-h u-h1">
                {{ transfer.value | pretty }} BIP
                <span class="transfer__value-usd u-h2">≈{{ $store.getters.getUsdPrice(transfer.value) | pretty }} USD</span>
            </div>

            <p class="transfer__success-more">
                <nuxt-link class="link--default u-fw-700" to="/">Wanna Monke money to someone?</nuxt-link>
            </p>
        </div>
    </div>
</template>
