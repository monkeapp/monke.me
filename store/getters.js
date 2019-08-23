

export default {
    getUsdPrice(state) {
        return function (value) {
            return state.usdPrice * value;
        }
    },

};
