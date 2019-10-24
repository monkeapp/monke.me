export default function ({ store, error }) {
    if (store.state.priceData.price) {
        return;
    }
    return store.dispatch('FETCH_PRICE');
}
