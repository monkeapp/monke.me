<script>

    export default {
        props: ['error'],
        head() {
            return {
                bodyAttrs: {
                    class: 'layout--splash'
                }
            };
        },
    };
</script>

<template>
    <main class="main-content--center error__section u-section">
        <div class="error__container u-container u-container--small">
            <div>
                <h1 class="u-h1 error__title">{{ error.statusCode }} Error</h1>
                <p v-if="error.statusCode === 404">Nothing’s here.</p>
                <p v-else-if="error.message">{{ error.message }}</p>
                <p v-else>Something went wrong.</p>
                <!--<a class="error__button button" href="/">Перейти на главную</a>-->
            </div>
            <figure class="u-aspect-ratio error__image" style="--aspect-ratio:329/300; width: 329px;">
                <img src="/img/error-404.png" srcset="/img/error-404@2x.png 2x" width="329" height="300" alt="" role="presentation">
            </figure>
        </div>
    </main>
</template>
