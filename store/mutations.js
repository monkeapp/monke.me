import Vue from 'vue';

export default {
    SET_NEW_TRANSFER: (state, transfer) => {
        state.savedNewTransfer = transfer;
    },
    SET_SAVED_ADDRESS: (state, address) => {
        state.savedAddress = address;
    },
    /**
     * Show snackbar if it is inactive
     */
    SET_SNACKBAR_ACTIVE: (state) => {
        state.isSnackbarActive = true;
    },
    /**
     * Set snackbar inactive so it can react to next SET_SNACKBAR_ACTIVE call
     */
    SET_SNACKBAR_INACTIVE: (state) => {
        state.isSnackbarActive = false;
    },
    SET_PREFERRED_LOCALE: (state, locale) => {
        state.preferredLocale = locale;
    },
};
