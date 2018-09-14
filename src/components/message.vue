<template>
    <div class="message">{{message}}</div>
</template>

<script>
    export default {
        props: {
            message: String
        }
    }
</script>

<style lang="scss" scoped>
    .message{
        position: fixed;
        left: 50%;
        top: 40%;
        transform: translate(-50%, 0);
        padding: 0.1rem 0.2rem;
        background-color: $maskColor;
        font-size: 0.32rem;
        color: $white;
        border-radius: 0.02rem;
    }
</style>