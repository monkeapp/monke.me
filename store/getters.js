import {BASE_COIN} from '~/assets/variables';

export default {
    BASE_COIN: () => BASE_COIN,
    getUsdPrice(state, getters) {
        return function (value) {
            return getters['explorer/bipPriceUsd'] * value;
        }
    },

};
