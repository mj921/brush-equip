<template>
    <div class="player-attr" v-show="visible">
        <div class="base-info">
            <dl>等级：{{player.lv}}</dl>
            <dl>战斗力：{{player.getCombatPower()}}</dl>
            <dl v-for="(attr, i) in player.getBaseInfo()" :key="i">{{attr.name}}：{{attr.value}}</dl>
            <button class="btn" @click="close">关闭</button>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            player: Object,
            visible: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            close () {
                this.$emit("update:visible", false);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .player-attr{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $maskColor;
        font-size: 0.245rem;
        .base-info{
            margin: 0.2rem;
            background-color: $white;
            height: calc(100% - 0.4rem);
            box-sizing: border-box;
            padding: 0.2rem;
            dl{
                line-height: 0.36rem;
            }
        }
    }
</style>