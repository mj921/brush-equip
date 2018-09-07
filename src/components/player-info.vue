<template>
    <div class="player-info">
        <dl>
            <label for="">HP：</label><be-hp-bar :curr="player.currHp" :max="player.hp"></be-hp-bar>
        </dl>
        <dl>
            <label for="">EXP：</label><be-hp-bar :curr="player.currExp" :max="player.maxExp" type="exp"></be-hp-bar>
        </dl>
    </div>
</template>

<script>
    import BeHpBar from './hp-bar.vue';
    export default {
        data () {
            return {}
        },
        props: {
            player: Object
        },
        components: {
            BeHpBar
        }
    }
</script>

<style lang="scss" scoped>
    .player-info{
        width: 100%;
        margin-bottom: 0.1rem;
        height: calc(20% - 0.1rem);
        font-size: 0.24rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid $black;
        padding: 0.1rem;
        dl{
            margin-bottom: 0.1rem;
            line-height: 0.3rem;
            height: 0.3rem;
            label{
                display: inline-block;
                width: 0.8rem;
            }
        }
    }
</style>