<template>
    <div class="enemy-info">
        <dl v-for="(enemy, i) in enemys" :key="i">
            <label :style="'color:' + enemy.color">{{enemy.name}}：</label>
            <be-hp-bar :curr="enemy.currHp" :max="enemy.hp"></be-hp-bar>
        </dl>
    </div>
</template>

<script>
    import BeHpBar from './hp-bar.vue';
    export default {
        props: {
            enemys: Array
        },
        components: {
            BeHpBar
        }
    }
</script>

<style lang="scss" scoped>
    .enemy-info{
        padding: 0.1rem;
        width: 100%;
        height: calc(25% - 0.1rem);
        margin-bottom: 0.1rem;
        font-size: 0.28rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid $black;
        dl{
            text-align: right;
            margin-bottom: 0.1rem;
            line-height: 0.3rem;
            height: 0.3rem;
            label{
                display: inline-block;
                width: 2.8rem;
                text-align: right;
            }
        }
    }
</style>