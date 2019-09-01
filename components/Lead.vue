<script>
    const TYPE_SEND = 'send';
    const TYPE_RECEIVE = 'receive';

    export default {
        ideFix: true,
        TYPE_SEND,
        TYPE_RECEIVE,
        props: {
            type: {
                type: String,
                required: true,
            }
        }
    }
</script>

<template>
    <div class="lead lead--send" :class="'lead--' + type">
        <div class="u-container">
            <div class="lead__content">
                <h1 class="lead__title">
                    <span v-if="type === $options.TYPE_SEND">Monke Money!</span>
                    <span v-else>Get Monke</span>
                </h1>
                <img class="lead__image lead__image--send u-hidden-medium-down" src="/img/lead-send.svg" alt="Monke me some Bip" v-if="type === $options.TYPE_SEND">
                <img class="lead__image lead__image--receive u-hidden-medium-down" src="/img/lead-receive.svg" alt="" role="presentation" v-else>
            </div>
        </div>
    </div>
</template>
