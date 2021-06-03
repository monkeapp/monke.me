export default function createStore() {
    return {
        /** @type Array<Transfer> */
        ownTransferList: [],
        savedAddress: null,
        isSnackbarActive: false,
    };
}




/**
 * @typedef {Object} Transaction
 * @property {string} name
 * @property {number} amount
 * @property {string} coin
 * @property {string} image
 * @property {string} timestamp
 */

