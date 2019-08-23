<script>
    // import Language from '~/layouts/_language';
    import Snackbar from '~/components/common/Snackbar';



    export default {
        components: {
            Snackbar,
        },
        data() {
            return {
                // isTestnetNoticeActive: false, // don't init value here because of https://github.com/nuxt/nuxt.js/issues/1552,
            };
        },

    };
</script>

<template>
    <div>
        <nuxt class=""/>

        <Snackbar/>
    </div>
</template>

