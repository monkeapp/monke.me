<script>
    import {pretty} from '~/assets/utils';
    import {BASE_COIN} from '~/assets/variables';

    export default {
        filters: {
            pretty,
        },
        props: {
            /** @type Transfer */
            transfer: {
                type: Object,
                required: true,
            }
        },
        computed: {
            baseValue() {
                if (!this.transfer || !this.transfer.values) {
                    return 0;
                }
                const baseCoin = this.transfer.values.find((item) => item.coin === BASE_COIN);

                return baseCoin ? baseCoin.value : 0;
            },
        },
    };
</script>

<template>
    <div class="u-h u-h1">
        <template v-if="transfer.values.length === 1 && baseValue">
            {{ baseValue | pretty }} {{ $store.getters.BASE_COIN }}
            <span class="transfer__value-usd">≈{{ $store.getters.getUsdPrice(baseValue) | pretty }} USD</span>
        </template>
        <template v-else>
            <div v-for="coin in transfer.values">
                {{ coin.value | pretty }} {{ coin.coin }}
            </div>
        </template>
    </div>
</template>
