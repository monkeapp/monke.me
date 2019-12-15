import {BASE_COIN} from '~/assets/variables';

export default {
    BASE_COIN: () => BASE_COIN,
    getUsdPrice(state) {
        return function (value) {
            return state.priceData.price * value;
        }
    },

};
