<template>
    <div class="simulation-fight" v-show="visible">
        <div class="container">
            <div class="enemy-info">
                <dl>
                    <span :style="'color:' + enemy1.color">{{enemy1.name}}</span>
                    <span>等级：{{enemy1.lv}}</span>
                    <span>胜率：{{fightNum > 0 ? (Math.floor(victoryNum1 / fightNum * 1000) / 10) : 0}}%</span>
                </dl>
                <dl>
                    <label for="">HP：</label><be-hp-bar :curr="enemy1.currHp" :max="enemy1.hp"></be-hp-bar>
                </dl>
            </div>
            <div class="enemy-info">
                <dl>
                    <span :style="'color:' + enemy2.color">{{enemy2.name}}</span>
                    <span>等级：{{enemy2.lv}}</span>
                    <span>胜率：{{fightNum > 0 ? (Math.floor(victoryNum2 / fightNum * 1000) / 10) : 0}}%</span>
                </dl>
                <dl>
                    <label for="">HP：</label><be-hp-bar :curr="enemy2.currHp" :max="enemy2.hp"></be-hp-bar>
                </dl>
            </div>
            <div class="config">
                <dl>
                    类型1：
                    <select v-model="enemyType1">
                        <option v-for="enemyType in enemyTypes" :value="enemyType.value" :label="enemyType.label"></option>
                    </select>
                </dl>
                <dl>
                    词缀1：
                    <select v-model="enemySuffix1">
                        <option v-for="enemySuffix in enemySuffixs" :value="enemySuffix.value" :label="enemySuffix.label"></option>
                    </select>
                </dl>
                <dl>
                    等级1：{{lv1}}
                    <button @click="addLv(1, 1)">+1</button>
                    <button @click="addLv(1, 10)">+10</button>
                    <button @click="addLv(1, 100)">+100</button>
                    <button @click="subLv(1, 1)">-1</button>
                    <button @click="subLv(1, 10)">-10</button>
                    <button @click="subLv(1, 100)">-100</button>
                </dl>
                <dl>
                    <button @click="createEnemy()">创建</button>
                </dl>
            </div>
            <div class="config">
                <dl>
                    类型2：
                    <select v-model="enemyType2">
                        <option v-for="enemyType in enemyTypes" :value="enemyType.value" :label="enemyType.label"></option>
                    </select>
                </dl>
                <dl>
                    词缀2：
                    <select v-model="enemySuffix2">
                        <option v-for="enemySuffix in enemySuffixs" :value="enemySuffix.value" :label="enemySuffix.label"></option>
                    </select>
                </dl>
                <dl>
                    等级2：{{lv2}}
                    <button @click="addLv(2, 1)">+1</button>
                    <button @click="addLv(2, 10)">+10</button>
                    <button @click="addLv(2, 100)">+100</button>
                    <button @click="subLv(2, 1)">-1</button>
                    <button @click="subLv(2, 10)">-10</button>
                    <button @click="subLv(2, 100)">-100</button>
                </dl>
                <dl>
                    <button @click="createEnemy()">创建</button>
                </dl>
            </div>
            <div>
                <dl>
                    战斗次数：{{fightNum}}
                </dl>
                <button @click="multFight(1)">战斗1次</button>
                <button @click="multFight(5)">战斗5次</button>
                <button @click="multFight(10)">战斗10次</button>
                <button @click="multFight(20)">战斗20次</button>
                <button @click="multFight(50)">战斗50次</button>
                <button @click="multFight(100)">战斗100次</button>
            </div>
            <div class="simulation-bottom clearfix">
                <div class="fr">
                    <button @click="close">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BeHpBar from './hp-bar.vue';
    import Enemy from '@/utils/enemy';
    import EnemyData from '@/utils/enemyData';
    import { Suffix } from '@/utils/data';
    export default {
        data () {
            return {
                enemy1: null,
                enemy2: null,
                sto1: null,
                sto2: null,
                enemyType1: "Slime",
                enemySuffix1: "Puniness",
                lv1: 1,
                enemyType2: "Slime",
                enemySuffix2: "Puniness",
                lv2: 1,
                enemyTypes: Object.keys(EnemyData).map(key => {
                    return {
                        label: EnemyData[key].name,
                        value: key
                    }
                }),
                enemySuffixs: Object.keys(Suffix).map(key => {
                    return {
                        label: Suffix[key].name,
                        value: key
                    }
                }),
                fightNum: 0,
                victoryNum1: 0,
                victoryNum2: 0
            }
        },
        props: {
            visible: Boolean
        },
        methods: {
            createEnemy () {
                this.fightNum = 0;
                this.victoryNum1 = 0;
                this.victoryNum2 = 0;
                this.clearSto();
                this.enemy1 = new Enemy(this.enemyType1, this.enemySuffix1, this.lv1);
                this.enemy2 = new Enemy(this.enemyType2, this.enemySuffix2, this.lv2);
            },
            initEnemy () {
                this.clearSto();
                this.enemy1 = new Enemy(this.enemyType1, this.enemySuffix1, this.lv1);
                this.enemy2 = new Enemy(this.enemyType2, this.enemySuffix2, this.lv2);
            },
            clearSto () {
                clearTimeout(this.sto1);
                clearTimeout(this.sto2);
            },
            // 战斗
            fight (cb) {
                this.initEnemy();
                let currEnemyIdx = 0;
                let atkFn1 = () => {
                    var ch = this.enemy1.attack(this.enemy2);
                    if (ch.currHp <= 0) {
                        this.clearSto();
                        this.$message({
                            message: this.enemy1.name + "胜利"
                        })
                        this.fightNum++;
                        this.victoryNum1++;
                        cb && cb()
                    } else {
                        this.sto1 = setTimeout(atkFn1, 1)
                    }
                }
                this.sto1 = setTimeout(atkFn1, 1);
                let atkFn2 = () => {
                    var ch = this.enemy2.attack(this.enemy1);
                    if (ch.currHp <= 0) {
                        this.clearSto();
                        this.$message({
                            message: this.enemy2.name + "胜利"
                        })
                        this.fightNum++;
                        this.victoryNum2++;
                        cb && cb()
                    } else {
                        this.sto2 = setTimeout(atkFn2, 1)
                    }
                }
                this.sto2 = setTimeout(atkFn2, 1);
            },
            multFight (num) {
                const _fight = () => {
                    if (num > 0) {
                        num--;
                        this.fight(_fight);
                    }
                }
                _fight();
            },
            addLv (type, lv) {
                this["lv" + type] += lv;
            },
            subLv (type, lv) {
                if (this["lv" + type] > lv) {
                    this["lv" + type] -= lv;
                } else {
                    this["lv" + type] = 1;
                }
            },
            close () {
                this.$emit("update:visible", false);
            }
        },
        components: {
            BeHpBar
        },
        watch: {
            visible () {
                if (!this.visible) {
                    this.clearSto();
                    this.createEnemy();
                }
            }
        },
        created () {
            this.createEnemy();
        }
    }
</script>

<style lang="scss" scoped>
    .simulation-fight{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $maskColor;
        font-size: 0.28rem;
        .container{
            margin: 0.1rem;
            background-color: $white;
            width: calc(100% - 0.2rem);
            height: calc(100% - 0.2rem);
            &>div{
                padding: 0.1rem;
            }
            .enemy-info{
                width: 100%;
                margin-bottom: 0.1rem;
                height: 1.2rem;
                font-size: 0.28rem;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                border-bottom: 1px solid $black;
                padding: 0.1rem;
                dl{
                    margin-bottom: 0.1rem;
                    line-height: 0.3rem;
                    height: 0.3rem;
                    label{
                        display: inline-block;
                        width: 0.8rem;
                    }
                    &>span{
                        display: inline-block;
                        width: 2rem;
                    }
                }
            }
            .config{
                border-bottom: 1px solid $black;
                padding: 0.1rem;
                dl{
                    margin-bottom: 0.1rem;
                    line-height: 0.3rem;
                    height: 0.3rem;
                    button{
                        margin-right: 0.1rem;
                    }
                }
            }
            .simulation-bottom{
                padding: 0.2rem;
            }
        }
    }
</style>