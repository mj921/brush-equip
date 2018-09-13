<template>
    <div class="fight-info">
        <ul>
            <li v-for="(msg, i) in msgList" v-html="msg"></li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            msgList: Array
        }
    }
</script>

<style lang="scss" scoped>
    .fight-info{
        position: relative;
        width: 100%;
        height: calc(30% - 0.1rem);
        font-size: 0.28rem;
        box-sizing: border-box;
        border: 1px solid $black;
        overflow: hidden;
        ul{
            position: absolute;
            bottom: 0;
            left: 0;
            padding-left: 0.1rem;
            line-height: 0.4rem;
        }
    }
</style>