<script>
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    import QrcodeVue from 'qrcode.vue';
    import {isValidAddress} from "minterjs-util/src/prefix";
    import {getServerValidator, fillServerErrors, getErrorText} from "~/assets/server-error";
    import {getReceiveInfo, claimReceive} from '~/api';
    import {pretty} from '~/assets/utils';
    import ButtonCopy from '~/components/common/ButtonCopy.vue';
    import Loader from '~/components/common/Loader';
    import Modal from '~/components/common/Modal';
    import Lead from '~/components/Lead';

    export default {
        components: {
            QrcodeVue,
            ButtonCopy,
            Loader,
            Modal,
            Lead,
        },
        mixins: [validationMixin],
        filters: {
            pretty,
        },
        asyncData({params}) {
            return getReceiveInfo(params.code)
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
                successValue: 0,
                isFormSending: false,
                serverError: '',
                serverSuccess: false,
                form: {
                    address: '',
                    password: '',

                },
                sve: {
                    address: {invalid: false, isActual: false, message: '', key: 'output_address'},
                    password: {invalid: false, isActual: false, message: ''},
                },
                isConfirmModalVisible: false,
            };
        },
        validations() {
            const form = {
                address: {
                    required,
                        validAddress: isValidAddress,
                        server: getServerValidator('address'),
                },
            };

            if (this.hasPassword) {
                form.password = {
                    required,
                    server: getServerValidator('password'),
                };
            }
            return {form};
        },
        computed: {
            hasPassword() {
                return false;
            },
        },
        methods: {
            submit() {
                if (this.isFormSending) {
                    return;
                }
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }
                this.isConfirmModalVisible = true;
            },
            claim() {
                this.isConfirmModalVisible = false;
                this.isFormSending = true;
                this.serverError = '';
                this.serverSuccess = false;
                // save value for later usage on success page
                this.successValue = this.transfer.value;

                claimReceive(this.$route.params.code, this.form.address)
                    .then(() => {
                        this.isFormSending = false;
                        this.serverSuccess = true;
                    })
                    .catch((error) => {
                        let hasValidationErrors = fillServerErrors(error, this.sve);
                        if (!hasValidationErrors) {
                            this.serverError = getErrorText(error);
                        }
                        this.isFormSending = false;
                    });
            },
        }


    };
</script>

<template>
    <div>
        <Lead type="receive"/>

        <div class="transfer u-container" v-if="!serverSuccess">
            <h2 class="u-h1">
                {{ transfer.value | pretty }} BIP
                <span class="transfer__value-usd u-h2">≈{{ $store.getters.getUsdPrice(transfer.value) | pretty }} USD</span>
            </h2>

            <form class="transfer__claim" novalidate @submit.prevent="submit">
                <div class="form-row">
                    <label class="form-field" :class="{'is-error': $v.form.address.$error}">
                        <span class="form-field__label">Enter your wallet address to recieve money</span>
                        <input class="form-field__input" type="text" placeholder="Your Bip Wallet Address"
                               v-model="form.address"
                               @blur="$v.form.address.$touch()"
                               @input="sve.address.isActual = false"
                        >
                    </label>
                    <span class="form-field__error" v-if="$v.form.address.$dirty && !$v.form.address.required">Enter address</span>
                    <span class="form-field__error" v-else-if="$v.form.address.$dirty && !$v.form.address.validAddress">Address is invalid</span>
                    <span class="form-field__error" v-if="$v.form.address.$dirty && !$v.form.address.server">{{ sve.address.message }}</span>
                </div>
                <div class="form-row" v-if="hasPassword">
                    <label class="form-field" :class="{'is-error': $v.form.password.$error}">
                        <span class="form-field__label">Sender set password for this transaction:</span>
                        <input class="form-field__input" type="password" placeholder="Transaction Password"
                               v-model="form.password"
                               @blur="$v.form.password.$touch()"
                               @input="sve.password.isActual = false"
                        >
                    </label>
                    <span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.required">Enter password</span>
                    <span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.server">{{ sve.password.message }}</span>
                </div>
                <div class="form-row">
                    <button class="button button--main">Monke to my Wallet</button>
                </div>
                <div class="form-row form__error" v-if="serverError">{{ serverError }}</div>
            </form>
        </div>

        <!-- Success -->
        <div class="transfer u-container" v-else>
            <h2 class="transfer__success-title u-h1">Monke Sent!</h2>
            <div class="u-h u-h1">
                {{ successValue | pretty }} BIP
                <span class="transfer__value-usd u-h2">≈{{ $store.getters.getUsdPrice(successValue) | pretty }} USD</span>
            </div>
            <p class="u-h u-h2">to {{ form.address }}</p>

            <p class="transfer__success-more">
                <nuxt-link class="link--default u-fw-700" to="/"> Wanna Monke money to someone?</nuxt-link>
            </p>
        </div>

        <!-- Modal -->
        <Modal v-bind:isOpen.sync="isConfirmModalVisible" :hideCloseButton="true">
            <h2 class="u-h1">
                Send
                <span class="transfer__confirm-value-bip">{{ transfer.value | pretty }} BIP</span>
                <span class="transfer__confirm-value-usd u-h2">≈{{ $store.getters.getUsdPrice(transfer.value) | pretty }} USD</span>
            </h2>
            <p class="transfer__confirm-address">to {{ form.address }}</p>
            <div class="transfer__receive-submit">
                <div class="button-group">
                    <button class="button button--main" type="button" data-test-id="walletSendModalSubmitButton" :class="{'is-loading': isFormSending}" @click="claim">
                        <span class="button__content">Confirm</span>
                        <Loader class="button__loader" :isLoading="true"/>
                    </button>
                    <button class="button button--ghost" type="button" v-if="!isFormSending" @click="isConfirmModalVisible = false">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>
