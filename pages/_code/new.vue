<script>
    import {generateMnemonic, walletFromMnemonic} from 'minterjs-wallet';
    import {validationMixin} from 'vuelidate';
    import withParams from 'vuelidate/lib/withParams';
    import {req} from 'vuelidate/lib/validators/common';
    import * as clipboard from 'clipbrd';
    import {getTransfer} from '~/api';
    import {pretty} from '~/assets/utils';
    import ButtonCopy from '~/components/common/ButtonCopy.vue';
    import Lead from '~/components/Lead';
    import TransferValue from '~/components/TransferValue';

    // checkbox validator
    const checked = withParams({ type: 'checked' }, (value) => {
        return !req(value) || value === true;
    });

    export default {
        components: {
            ButtonCopy,
            Lead,
            TransferValue,
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
                        // step: 2,
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
                mnemonic: '',
                isMnemonicSaved: false,
                isToastVisible: false,
                isShowed: false,
                file: null,
            };
        },
        validations: {
            isMnemonicSaved: {
                checked,
            },
        },
        computed: {
            isClipboardSupported() {
                return clipboard.isSupported();
            },
            address() {
                if (!this.mnemonic) {
                    return;
                }
                const wallet = walletFromMnemonic(this.mnemonic);
                return wallet.getAddressString();
            },
        },
        beforeMount() {
            this.mnemonic = generateMnemonic();
            this.setDownload(this.mnemonic, this.address);
        },
        destroyed() {
            this.clearDownload();
        },
        methods: {
            submit() {
                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }

                this.$store.commit('SET_SAVED_ADDRESS', this.address);
                this.$router.push(`/${this.$route.params.code}/receive`);
            },
            setDownload(text, name) {
                this.clearDownload();
                const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
                this.$set(this, 'file', {
                    url: URL.createObjectURL(file),
                    name: name + '.txt',
                });
            },
            clearDownload() {
                if (this.file && this.file.url) {
                    URL.revokeObjectURL(this.file.url);
                }
            },
        }


    };
</script>

<template>
    <div>
        <Lead type="receive"/>

        <div class="transfer u-container">
            <div class="transfer__claim">
                <h2>
                    <TransferValue :transfer="transfer"/>
                </h2>
                <p class="transfer__new-address u-h u-h2">{{ address }}</p>
                <p>We’ve created BIP wallet for you. Before you get the money you need to save the seed phrase of your wallet.</p>
                <p>Using this seed phrase you can get access to your funds.</p>

                <form class="transfer__claim-form" novalidate @submit.prevent="submit">
                    <div class="form-row">
                        <div class="form-field">
                            <textarea
                                    class="form-field__input" type="text" rows="3" readonly
                                    :class="{'transfer__new-mnemonic--hidden': !isShowed}"
                                    :value="mnemonic"
                            ></textarea>
                            <button class="transfer__new-show link--button u-semantic-button" type="button" v-if="!isShowed" @click="isShowed = true">
                                Show Seed Phrase
                            </button>
                        </div>
                    </div>
                    <div class="form-row" v-if="isShowed">
                        <div class="button-group">
                            <ButtonCopy class="u-icon-wrap link--button u-semantic-button" :copy-text="mnemonic">
                                <img class="u-icon u-icon--copy--left" src="/img/icon-copy.svg" alt="" role="presentation">
                                <span class="u-icon-text">Copy Seed Phrase</span>
                            </ButtonCopy>
                            <a class="u-icon-wrap link--button" target="_blank" rel="noopener"
                               :href="file.url"
                               :download="file.name" v-if="file"
                            >
                                <img class="u-icon u-icon--copy--left" src="/img/icon-download.svg" alt="" role="presentation">
                                <span class="u-icon-text">Save</span>
                            </a>
                        </div>
                    </div>
                    <div class="form-row" v-if="isShowed">
                        <label class="form-checkbox" :class="{'is-error': $v.isMnemonicSaved.$error}">
                            <input class="form-checkbox__input-native" type="checkbox" v-model="isMnemonicSaved"/>
                            <span class="form-checkbox__input-visible"></span>
                            <span class="form-checkbox__label">I've saved the seed phrase</span>
                        </label>
                    </div>
                    <div class="form-row" v-if="isShowed">
                        <button class="button button--full button--main">Receive funds to this address</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</template>
