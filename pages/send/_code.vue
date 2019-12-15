<script>
    import {validationMixin} from 'vuelidate';
    import required from 'vuelidate/lib/validators/required';
    // import minLength from 'vuelidate/lib/validators/minLength';
    // import maxLength from 'vuelidate/lib/validators/maxLength';
    import sameAs from 'vuelidate/lib/validators/sameAs';
    import QrcodeVue from 'qrcode.vue';
    import {getServerValidator, fillServerErrors, getErrorText} from "~/assets/server-error";
    import {getOwnTransfer, getTransfer, updateTransfer} from '~/api';
    import {pretty} from '~/assets/utils';
    import ButtonCopy from '~/components/common/ButtonCopy.vue'
    import Lead from '~/components/Lead';
    import TransferValue from '~/components/TransferValue';

    let transferInterval;

    export default {
        components: {
            QrcodeVue,
            ButtonCopy,
            Lead,
            TransferValue,
        },
        mixins: [validationMixin],
        filters: {
            pretty,
        },
        asyncData({params, store}) {
            const ownTransfer = store.state.ownTransferList.find((item) => item.receiver_id_code === params.code);
            if (ownTransfer) {
                // don't make api call here to not delay redirect from index after transfer created
                return {
                    transfer: ownTransfer,
                    creatorIdCode: ownTransfer.creator_id_code,
                };
            } else {
                return getTransfer(params.code)
                    .then((transfer) => {
                        return {
                            transfer,
                            step: 2,
                        };
                    });
            }
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
                creatorIdCode: '',
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
                // 1 - set password, 2 - copy url
                step: 1,
            };
        },
        validations() {
            const validationRules = {
                transfer: {
                    hasValue: () => this.hasValue,
                }
            };
            if (this.isPasswordActive) {
                validationRules.form = {
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
                };
            }
            return validationRules;
        },
        computed: {
            hasValue() {
                return Number(this.transfer.value);
            },
            receiveLink() {
                return `/${this.transfer.receiver_id_code}`;
            },
            receiveLinkText() {
                return window.location.host + this.receiveLink;
            },
            receiveLinkFull() {
                return window.location.protocol + '//' + this.receiveLinkText;
            }
        },
        mounted() {
            const getTransferPromise = () => {
                const transferPromise = this.creatorIdCode ? getOwnTransfer(this.creatorIdCode) : getTransfer(this.$route.params.code);
                return transferPromise
                    .then((transfer) => {
                        this.transfer = transfer;
                        if (this.creatorIdCode) {
                            this.$store.commit('UPDATE_OWN_TRANSFER', {creatorIdCode: this.creatorIdCode, transfer});
                        }
                    });
            };

            // ensure to update own transfer deposit value on load
            if (this.creatorIdCode) {
                getTransferPromise();
            }
            // update transfer amount
            transferInterval = setInterval(getTransferPromise, 10 * 1000)
        },
        destroyed() {
            clearImmediate(transferInterval);
        },
        methods: {
            activatePassword() {
                this.isPasswordActive = true;
            },
            deactivatePassword() {
                this.isPasswordActive = false;
            },
            submit() {
                if (this.isFormSending) {
                    return;
                }

                if (this.$v.$invalid) {
                    this.$v.$touch();
                    return;
                }

                if (!this.isPasswordActive) {
                    this.finishTransfer();
                    return;
                }

                this.isFormSending = true;

                updateTransfer(this.creatorIdCode, this.form.password)
                    .then((transfer) => {
                        this.transfer = transfer;
                        this.finishTransfer();
                        // don't remove loader during redirect
                        this.isFormSending = false;
                    })
                    .catch((error) => {
                        let hasValidationErrors = fillServerErrors(error, this.sve);
                        if (!hasValidationErrors) {
                            this.serverError = getErrorText(error);
                        }
                        this.isFormSending = false;
                    });
            },
            // finish transfer creation
            finishTransfer() {
                this.$store.commit('REMOVE_OWN_TRANSFER', this.creatorIdCode);
                this.step = 2;
            }
        },


    };
</script>

<template>
    <div>
        <Lead type="send"/>

        <!-- STEP 1 -->
        <form class="transfer transfer--send u-container" novalidate @submit.prevent="submit" v-if="step === 1">
            <QrcodeVue class="transfer__qr" :value="transfer.input_deposit.address" :size="195" level="L"/>
            <div class="transfer--send__content">
                <h2 class="transfer__title">Send {{ transfer.input_deposit.network_code }} to:</h2>
                <div class="transfer__address form-row--medium u-h2 u-icon-wrap">
                    <span class="u-icon-text">{{ transfer.input_deposit.address }}</span>
                    <ButtonCopy class="u-icon u-icon--copy--right u-semantic-button link--opacity" aria-label="Copy" :copy-text="transfer.input_deposit.address">
                        <img src="/img/icon-copy.svg" alt="Copy">
                    </ButtonCopy>
                </div>

                <div class="transfer__password form-row--medium">
                    <button
                        class="link link--main link--opacity u-semantic-button u-icon-wrap" type="button"
                        :key="isPasswordActive"
                        @click="activatePassword"
                        v-if="!isPasswordActive"
                    >
                        <img class="u-icon u-icon--password--left" src="/img/icon-password.svg" alt="" role="presentation">
                        <span class="u-icon-text">Create Transaction Password</span>
                    </button>

                    <template v-else>
                        <div class="transfer__password-cell">
                            <label class="form-field" :class="{'is-error': $v.form.password.$error}">
                                <input class="form-field__input" type="password" autocomplete="new-password" placeholder="Password"
                                       v-model="form.password"
                                       @blur="$v.form.password.$touch()"
                                       @input="sve.password.isActual = false"
                                >
                            </label>
                            <span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.required">Enter password</span>
                            <!--<span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.minLength">{{ $td('Password is too short', 'index.auth-error-password-min') }}</span>
                            <span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.maxLength">{{ $td('Password is too long', 'index.auth-error-password-max') }}</span>-->
                            <span class="form-field__error" v-if="$v.form.password.$dirty && !$v.form.password.server">{{ sve.password.message }}</span>
                        </div>
                        <div class="transfer__password-cell">
                            <label class="form-field" :class="{'is-error': $v.form.passwordConfirm.$error}">
                                <input class="form-field__input" type="password" placeholder="Repeat password"
                                       v-model="form.passwordConfirm"
                                       @blur="$v.form.passwordConfirm.$touch()"
                                >
                            </label>
                            <span class="form-field__error" v-if="$v.form.passwordConfirm.$dirty && !$v.form.passwordConfirm.required">Repeat password</span>
                            <span class="form-field__error" v-if="$v.form.passwordConfirm.$dirty && $v.form.passwordConfirm.required && !$v.form.passwordConfirm.sameAsPassword">Passwords don't match</span>
                        </div>
                        <button class="transfer__password-close u-icon u-semantic-button link--opacity" type="button" aria-label="Remove password" @click="deactivatePassword">
                            <img src="/img/icon-close.svg" alt="Copy">
                        </button>
                    </template>
                </div>

                <div class="transfer__submit form-row--medium" :class="{'transfer__submit--panel': hasValue}">
                    <div class="transfer__submit-label" v-if="hasValue">Received:</div>
                    <TransferValue class="transfer__submit-value" :transfer="transfer" v-if="hasValue"/>
                    <button class="transfer__submit-button button button--yellow" :class="{'is-disabled': $v.$invalid}">Make transfer</button>
                </div>

                <div class="form-row--medium form__error" v-if="$v.transfer.$error">Please fulfill transaction before continue</div>
            </div>
        </form>

        <!-- STEP 2 -->
        <div class="transfer u-container" v-if="step === 2">
            <h2>
                <TransferValue :transfer="transfer"/>
            </h2>
            <p>
                All assets available at: <br>
                <nuxt-link class="transfer__receive-link link--default" :to="receiveLink">{{ receiveLinkText }}</nuxt-link>
            </p>

            <div class="transfer__receive-submit">
                <div class="button-group">
                    <ButtonCopy class="button button--main" aria-label="Copy" :copy-text="receiveLinkFull">
                        Copy URL
                    </ButtonCopy>
                    <nuxt-link class="link--default u-fw-700" to="/">One more?</nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>
