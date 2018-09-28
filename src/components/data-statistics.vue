<template>
    <div class="statistics" v-show="visible">
        <div class="container">
            <dl>
                <label>游戏时长：</label>{{time}}
            </dl>
            <dl>
                <label>战斗胜利次数：</label>{{this.fightNum.victory}}
            </dl>
            <dl>
                <label>战斗失败次数：</label>{{this.fightNum.loss}}
            </dl>
            <dl>
                <label>离线击杀怪物数：</label>{{this.fightNum.onHook}}
            </dl>
            <dl>
                <button @click="close">关闭</button>
            </dl>
        </div>
    </div>
</template>
<script>
    import { NormalProbabilityEnemyNum, NormalProbabilityEnemySuffix, BossProbabilityEnemyNum, BossProbabilityEnemySuffix, ProbabilityArr, Suffix } from '@/utils/data';
    import { millisecondFmt } from '@/utils/util';
    export default {
        data () {
            return {
                time: "0",
                timeSto: null
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            fightNum: Object,
            startTime: Number,
            killEnemyTypeNum: Object,
            killEnemySuffixNum: Object
        },
        methods: {
            getTime () {
                if (this.startTime) {
                    this.time = millisecondFmt(new Date().getTime() - this.startTime);
                } else {
                    this.time = "0";
                }
                this.timeSto = setTimeout(this.getTime, 1000);
            },
            close () {
                this.$emit("update:visible", false);
            }
        },
        watch: {
            visible () {
                if (this.visible) {
                    this.getTime();
                } else {
                    clearTimeout(this.timeSto);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .statistics{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $maskColor;
        .container{
            margin: 0.1rem;
            width: calc(100% - 0.2rem);
            height: calc(100% - 0.2rem);
            background-color: $white;
            font-size: 0.32rem;
        }
    }
</style>