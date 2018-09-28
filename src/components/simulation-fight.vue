<template>
    <div class="simulation-fight" v-show="visible">
        <div class="container">
            <div class="tabs">
                <dl :class="{'curr': tabIndex === 0}" @click="changeTab(0)">已有怪物模拟</dl>
                <dl :class="{'curr': tabIndex === 1}" @click="changeTab(1)">自定义怪物模拟</dl>
            </div>
            <div class="panel" v-show="tabIndex === 0">
                <div class="enemy-info">
                    <dl>
                        <span>怪物1</span>
                        <span>等级：{{panel[0].enemy1.lv}}</span>
                        <span>胜率：{{panel[0].fightNum > 0 ? (Math.floor(panel[0].victoryNum1 / panel[0].fightNum * 1000) / 10) : 0}}%</span>
                    </dl>
                    <dl>
                        <label for="">HP：</label><be-hp-bar :curr="panel[0].enemy1.currHp" :max="panel[0].enemy1.hp"></be-hp-bar>
                    </dl>
                </div>
                <div class="enemy-info">
                    <dl>
                        <span>怪物2</span>
                        <span>等级：{{panel[0].enemy2.lv}}</span>
                        <span>胜率：{{panel[0].fightNum > 0 ? (Math.floor(panel[0].victoryNum2 / panel[0].fightNum * 1000) / 10) : 0}}%</span>
                    </dl>
                    <dl>
                        <label for="">HP：</label><be-hp-bar :curr="panel[0].enemy2.currHp" :max="panel[0].enemy2.hp"></be-hp-bar>
                    </dl>
                </div>
                <div class="config config0">
                    <dl>
                        类型1：
                        <select v-model="panel[0].enemyType1">
                            <option v-for="enemyType in enemyTypes" :value="enemyType.value">{{enemyType.label}}</option>
                        </select>
                    </dl>
                    <dl>
                        词缀1：
                        <select v-model="panel[0].enemySuffix1">
                            <option v-for="enemySuffix in enemySuffixs" :value="enemySuffix.value">{{enemySuffix.label}}</option>
                        </select>
                    </dl>
                    <dl>
                        等级1：{{panel[0].lv1}}
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
                <div class="config config0">
                    <dl>
                        类型2：
                        <select v-model="panel[0].enemyType2">
                            <option v-for="enemyType in enemyTypes" :value="enemyType.value">{{enemyType.label}}</option>
                        </select>
                    </dl>
                    <dl>
                        词缀2：
                        <select v-model="panel[0].enemySuffix2">
                            <option v-for="enemySuffix in enemySuffixs" :value="enemySuffix.value">{{enemySuffix.label}}</option>
                        </select>
                    </dl>
                    <dl>
                        等级2：{{panel[0].lv2}}
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
                        战斗次数：{{panel[0].fightNum}}
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
            <div class="panel" v-show="tabIndex === 1">
                <div class="enemy-info">
                    <dl>
                        <span>怪物1</span>
                        <span>等级：{{panel[1].enemy1.lv}}</span>
                        <span>胜率：{{panel[1].fightNum > 0 ? (Math.floor(panel[1].victoryNum1 / panel[1].fightNum * 1000) / 10) : 0}}%</span>
                    </dl>
                    <dl>
                        <label for="">HP：</label><be-hp-bar :curr="panel[1].enemy1.currHp" :max="panel[1].enemy1.hp"></be-hp-bar>
                    </dl>
                </div>
                <div class="enemy-info">
                    <dl>
                        <span>怪物2</span>
                        <span>等级：{{panel[1].enemy2.lv}}</span>
                        <span>胜率：{{panel[1].fightNum > 0 ? (Math.floor(panel[1].victoryNum2 / panel[1].fightNum * 1000) / 10) : 0}}%</span>
                    </dl>
                    <dl>
                        <label for="">HP：</label><be-hp-bar :curr="panel[1].enemy2.currHp" :max="panel[1].enemy2.hp"></be-hp-bar>
                    </dl>
                </div>
                <div class="config config1 clearfix">
                    <dl>
                        生命1：
                        <input type="text" v-model="panel[1].enemyOpt1.hp">
                    </dl>
                    <dl>
                        最小攻击1：
                        <input type="text" v-model="panel[1].enemyOpt1.minAtk">
                    </dl>
                    <dl>
                        最大攻击1：
                        <input type="text" v-model="panel[1].enemyOpt1.maxAtk">
                    </dl>
                    <dl>
                        物抗1：
                        <input type="text" v-model="panel[1].enemyOpt1.def">
                    </dl>
                    <dl>
                        命中1：
                        <input type="text" v-model="panel[1].enemyOpt1.hit">
                    </dl>
                    <dl>
                        闪避1：
                        <input type="text" v-model="panel[1].enemyOpt1.dodge">
                    </dl>
                    <dl>
                        暴击1：
                        <input type="text" v-model="panel[1].enemyOpt1.crt">
                    </dl>
                    <dl>
                        暴击伤害1：
                        <input type="text" v-model="panel[1].enemyOpt1.crtDamage">
                    </dl>
                    <dl>
                        <button @click="createEnemy(1)">创建</button>
                    </dl>
                </div>
                <div class="config config1 clearfix">
                    <dl>
                        生命2：
                        <input type="text" v-model="panel[1].enemyOpt2.hp">
                    </dl>
                    <dl>
                        最小攻击2：
                        <input type="text" v-model="panel[1].enemyOpt2.minAtk">
                    </dl>
                    <dl>
                        最大攻击2：
                        <input type="text" v-model="panel[1].enemyOpt2.maxAtk">
                    </dl>
                    <dl>
                        物抗2：
                        <input type="text" v-model="panel[1].enemyOpt2.def">
                    </dl>
                    <dl>
                        命中2：
                        <input type="text" v-model="panel[1].enemyOpt2.hit">
                    </dl>
                    <dl>
                        闪避2：
                        <input type="text" v-model="panel[1].enemyOpt2.dodge">
                    </dl>
                    <dl>
                        暴击2：
                        <input type="text" v-model="panel[1].enemyOpt2.crt">
                    </dl>
                    <dl>
                        暴击伤害2：
                        <input type="text" v-model="panel[1].enemyOpt2.crtDamage">
                    </dl>
                    <dl>
                        <button @click="createEnemy(1)">创建</button>
                    </dl>
                </div>
                <div>
                    <dl>
                        战斗次数：{{panel[1].fightNum}} <button @click="reset">重置</button>
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
    </div>
</template>

<script>
    import BeHpBar from './hp-bar.vue';
    import Enemy from '@/utils/enemy';
    import Character from '@/utils/character';
    import EnemyData from '@/utils/enemyData';
    import { Suffix } from '@/utils/data';
    export default {
        data () {
            return {
                panel: [
                    {
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
                        fightNum: 0,
                        victoryNum1: 0,
                        victoryNum2: 0
                    },
                    {
                        enemy1: null,
                        enemy2: null,
                        sto1: null,
                        sto2: null,
                        enemyOpt1: {
                            name: "怪物1",
                            hp: 100,
                            lv: 1,
                            minAtk: 1,
                            maxAtk: 1,
                            def: 1,
                            speed: 1,
                            hit: 70,
                            dodge: 0,
                            crt: 0,
                            crtDamage: 150
                        },
                        enemyOpt2: {
                            name: "怪物2",
                            hp: 100,
                            lv: 1,
                            minAtk: 1,
                            maxAtk: 1,
                            def: 1,
                            speed: 1,
                            hit: 70,
                            dodge: 0,
                            crt: 0,
                            crtDamage: 150,
                        },
                        fightNum: 0,
                        victoryNum1: 0,
                        victoryNum2: 0
                    }
                ],
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
                tabIndex: 0
            }
        },
        props: {
            visible: Boolean
        },
        methods: {
            changeTab (tabIndex) {
                this.tabIndex = tabIndex;
                this.clearSto();
            },
            createEnemy (tabIndex = 0) {
                this.panel[tabIndex].fightNum = 0;
                this.panel[tabIndex].victoryNum1 = 0;
                this.panel[tabIndex].victoryNum2 = 0;
                this.initEnemy(tabIndex);
            },
            initEnemy (tabIndex = 0) {
                this.clearSto();
                switch (tabIndex) {
                    case 0:
                        this.panel[0].enemy1 = new Enemy(this.panel[0].enemyType1, this.panel[0].enemySuffix1, this.panel[0].lv1);
                        this.panel[0].enemy2 = new Enemy(this.panel[0].enemyType2, this.panel[0].enemySuffix2, this.panel[0].lv2);
                        break;
                    case 1:
                        Object.keys(this.panel[1].enemyOpt1).forEach(key => {
                            if (/^\d+$/.test(this.panel[1].enemyOpt1[key])) {
                                this.panel[1].enemyOpt1[key] = +this.panel[1].enemyOpt1[key];
                            }
                        })
                        Object.keys(this.panel[1].enemyOpt2).forEach(key => {
                            if (/^\d+$/.test(this.panel[1].enemyOpt2[key])) {
                                this.panel[1].enemyOpt2[key] = +this.panel[1].enemyOpt2[key];
                            }
                        })
                        this.panel[1].enemy1 = new Character(this.panel[1].enemyOpt1);
                        this.panel[1].enemy2 = new Character(this.panel[1].enemyOpt2);
                        break;
                }
            },
            clearSto () {
                clearTimeout(this.panel[0].sto1);
                clearTimeout(this.panel[0].sto2);
                clearTimeout(this.panel[1].sto1);
                clearTimeout(this.panel[1].sto2);
            },
            // 战斗
            fight (cb) {
                this.initEnemy(this.tabIndex);
                let currEnemyIdx = 0;
                let atkFn1 = () => {
                    var ch = this.panel[this.tabIndex].enemy1.attack(this.panel[this.tabIndex].enemy2);
                    if (ch.currHp <= 0) {
                        this.clearSto();
                        this.$message({
                            message: this.panel[this.tabIndex].enemy1.name + "胜利"
                        })
                        this.panel[this.tabIndex].fightNum++;
                        this.panel[this.tabIndex].victoryNum1++;
                        cb && cb()
                    } else {
                        this.panel[this.tabIndex].sto1 = setTimeout(atkFn1, 1)
                    }
                }
                this.panel[this.tabIndex].sto1 = setTimeout(atkFn1, 1);
                let atkFn2 = () => {
                    var ch = this.panel[this.tabIndex].enemy2.attack(this.panel[this.tabIndex].enemy1);
                    if (ch.currHp <= 0) {
                        this.clearSto();
                        this.$message({
                            message: this.panel[this.tabIndex].enemy2.name + "胜利"
                        })
                        this.panel[this.tabIndex].fightNum++;
                        this.panel[this.tabIndex].victoryNum2++;
                        cb && cb()
                    } else {
                        this.panel[this.tabIndex].sto2 = setTimeout(atkFn2, 1)
                    }
                }
                this.panel[this.tabIndex].sto2 = setTimeout(atkFn2, 1);
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
                this.panel[this.tabIndex]["lv" + type] += lv;
            },
            subLv (type, lv) {
                if (this["lv" + type] > lv) {
                    this.panel[this.tabIndex]["lv" + type] -= lv;
                } else {
                    this.panel[this.tabIndex]["lv" + type] = 1;
                }
            },
            close () {
                this.$emit("update:visible", false);
            },
            reset () {
                this.panel = [
                    {
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
                        fightNum: 0,
                        victoryNum1: 0,
                        victoryNum2: 0
                    },
                    {
                        enemy1: null,
                        enemy2: null,
                        sto1: null,
                        sto2: null,
                        enemyOpt1: {
                            name: "怪物1",
                            hp: 100,
                            lv: 1,
                            minAtk: 1,
                            maxAtk: 1,
                            def: 1,
                            speed: 1,
                            hit: 70,
                            dodge: 0,
                            crt: 0,
                            crtDamage: 150
                        },
                        enemyOpt2: {
                            name: "怪物2",
                            hp: 100,
                            lv: 1,
                            minAtk: 1,
                            maxAtk: 1,
                            def: 1,
                            speed: 1,
                            hit: 70,
                            dodge: 0,
                            crt: 0,
                            crtDamage: 150,
                        },
                        fightNum: 0,
                        victoryNum1: 0,
                        victoryNum2: 0
                    }
                ];
                this.createEnemy();
                this.createEnemy(1);
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
            this.createEnemy(1);
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
        .tabs{
            height: 0.6rem;
            line-height: 0.6rem;
            border-bottom: 1px solid $red;
            dl{
                float: left;
                width: 50%;
                height: 100%;
                box-sizing: border-box;
                text-align: center;
                &.curr{
                    background-color: $red;
                    color: $white;
                }
            }
        }
        .container{
            margin: 0.1rem;
            background-color: $white;
            width: calc(100% - 0.2rem);
            height: calc(100% - 0.2rem);
            .panel{
                &>div{
                padding: 0.1rem;
            }
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
                &.config0{
                    dl{
                        line-height: 0.4rem;
                        height: 0.4rem;
                    }
                }
                &.config1{
                    dl{
                        width: 50%;
                        float: left;
                        padding-right: 0.1rem;
                        box-sizing: border-box;
                        input{
                            width: 1.6rem;
                            float: right;
                            box-sizing: border-box;
                            padding-left: 0.1rem;
                        }
                    }
                }
            }
            .simulation-bottom{
                padding: 0.2rem;
            }
        }
    }
</style>