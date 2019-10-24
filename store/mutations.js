import Vue from 'vue';

export default {
    SET_OWN_TRANSFER: (state, transfer) => {
        state.ownTransferList.push(transfer);
    },
    REMOVE_OWN_TRANSFER: (state, creatorIdCode) => {
        state.ownTransferList = state.ownTransferList.filter((item) => item.creator_id_code !== creatorIdCode);
    },
    SET_SAVED_ADDRESS: (state, address) => {
        state.savedAddress = address;
    },
    SET_PRICE_DATA: (state, data) => {
        state.priceData = data;
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
