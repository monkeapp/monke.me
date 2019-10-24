

export default {
    getUsdPrice(state) {
        return function (value) {
            return state.priceData.price * value;
        }
    },

};
