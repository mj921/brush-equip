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
        font-size: 0.24rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid $black;
        overflow: hidden;
        ul{
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }
</style>