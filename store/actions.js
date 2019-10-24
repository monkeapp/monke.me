import {getPrice} from '~/api/convert';

export default {
    FETCH_PRICE,
};

function FETCH_PRICE({commit }) {
    return getPrice()
        .then((priceData) => {
            commit('SET_PRICE_DATA', priceData);

            const nextUpdate = priceData.next_update ? new Date(priceData.next_update).getTime() : 0;
            const diff = nextUpdate - Date.now();
            const updateTimeout = Math.max(diff, 3000);
            setTimeout(() => FETCH_PRICE({ commit }), updateTimeout);

            return priceData;
        })
        .catch((resError) => {
            console.log(resError);
            setTimeout(() => FETCH_PRICE({ commit }), 20000);
        });
}
