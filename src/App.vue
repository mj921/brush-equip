<template>
    <div id="app">
        <be-player-info :player="player"></be-player-info>
        <be-enemy-info :enemys="enemys"></be-enemy-info>
        <div class="button-group">
            <button @click="showKnapsack">背包</button>
            <button @click="showPlayerAttr">属性</button>
            <button @click="changeAutoFight">{{autoFightFlag ? '关闭自动' : '自动战斗'}}</button>
            <button @click="initGame">重新开始</button>
        </div>
        <be-fight-info :msgList="msgList"></be-fight-info>
        <be-knapsack :player="player" :visible.sync="knapsackVisible"></be-knapsack>
        <be-player-attr :player="player" :visible.sync="playerAttrVisible"></be-player-attr>
    </div>
</template>

<script>
import Enemy from '@/utils/enemy';
import Player from '@/utils/player';
import Equip from '@/utils/equip';
import BePlayerInfo from '@/components/player-info.vue';
import BeEnemyInfo from '@/components/enemy-info.vue';
import BeFightInfo from '@/components/fight-info.vue';
import BeKnapsack from '@/components/knapsack.vue';
import BePlayerAttr from '@/components/playerAttr.vue';
import { ProbabilityEnemyNum, NormalProbabilityEnemySuffix, ProbabilityArr } from '@/utils/data';
import { deepCopy } from '@/utils/util';
export default {
    name: 'App',
    data () {
        return {
            player: null,
            enemys: [],
            gameSpeed: 10,
            recoverySpeed: 2, // 每0.1s恢复最大生命值百分比
            autoFightFlag: false,
            inBattleFlag: false,
            knapsackVisible: false,
            playerAttrVisible: false,
            fightInfo: [],
            msgList: [],
            enemyLv: 1,
            enemyNum: 0
        }
    },
    methods: {
        fight () {
            this.inBattleFlag = true;
            let currEnemyIdx = 0;
            let enemyStos = [];
            let playerSto;
            let clearSto = () => {
                clearTimeout(playerSto);
                enemyStos.forEach(sto => {
                    clearTimeout(sto);
                });
            }
            let playerAtkFn = () => {
                var ch = this.player.attack(this.enemys[currEnemyIdx]);
                if (ch.msg) {
                    this.log(ch.msg);
                }
                if (ch.currHp === 0) {
                    currEnemyIdx++;
                    if (currEnemyIdx < this.enemys.length) {
                        playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed)
                    } else {
                        clearSto();
                        this.victory();
                    }
                } else {
                    playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed);
                }
            }
            playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed);
            let enemyAtkFn = (i) => {
                var ch = this.enemys[i].attack(this.player);
                if (ch.msg) {
                    this.log(ch.msg);
                }
                if (ch.currHp === 0) {
                    clearSto();
                    this.loss();
                } else {
                    clearTimeout(enemyStos[i]);
                    enemyStos[i] = setTimeout(() => {
                        enemyAtkFn(i);
                    }, this.enemys[i].interval * 1000 / this.gameSpeed)
                }
            }
            this.enemys.forEach((enemy, i) => {
                enemyStos[i] = setTimeout(() => {
                    enemyAtkFn(i);
                }, enemy.interval * 1000 / this.gameSpeed);
            })
        },
        fallDownEquipment () {
            let equips = [];
            this.enemys.forEach(enemy => {
                equips.push(enemy.fallDownEquipment());
            })
            this.log(`获得 ${equips.map(equip => '<span style="color: ' + equip.equipQuality.color + '">' + equip.getName() + '</span>').join('、')}`)
            this.player.getEquips(equips);
        },
        getExp () {
            let exp = 0;
            this.enemys.forEach(enemy => {
                exp += enemy.exp;
            })
            this.player.getExp(exp);
        },
        loss () {
            this.log("战斗失败");
            if (this.enemyNum > 0) {
                this.enemyNum--;
            } else if (this.enemyLv > 1) {
                this.enemyLv--;
                this.enemyNum = 9;
            } else {
                this.enemyLv = 1;
                this.enemyNum = 0;
            }
            localStorage.setItem("enemyLv", this.enemyLv);
            localStorage.setItem("enemyNum", this.enemyNum);
            this.player.autoRcoveryHp(this.recoverySpeed, () => {
                this.createEnemys();
                this.inBattleFlag = false;
            });
        },
        victory () {
            this.log("战斗胜利");
            this.fallDownEquipment();
            this.getExp();
            if (this.enemyNum < 9) {
                this.enemyNum++;
            } else {
                this.enemyLv++;
                this.enemyNum = 0;
            }
            localStorage.setItem("enemyLv", this.enemyLv);
            localStorage.setItem("enemyNum", this.enemyNum);
            this.player.autoRcoveryHp(this.recoverySpeed, () => {
                this.createEnemys();
                this.inBattleFlag = false;
            });
        },
        createEnemys () {
            this.enemys = [];
            let proEnemyNumArr = ProbabilityArr(ProbabilityEnemyNum);
            let total = proEnemyNumArr.reduce((total, num) => {
                return (typeof total === "number" ? total : total.value) + num.value;
            })
            let currP = Math.floor(Math.random() * total);
            let num = 1;
            for (let i = 0; i < proEnemyNumArr.length; i++) {
                currP -= proEnemyNumArr[i].value;
                if (currP < 0) {
                    num = +proEnemyNumArr[i].key;
                    break;
                }
            }
            for (let i = 0; i < num; i++) {
                this.createEnemy();
            }
            if (this.autoFightFlag) {
                this.fight();
            }
        },
        createEnemy () {
            let norProEnemySuffixArr = ProbabilityArr(NormalProbabilityEnemySuffix);
            let total = norProEnemySuffixArr.reduce((total, num) => {
                return (typeof total === "number" ? total : total.value) + num.value;
            })
            let currP = Math.floor(Math.random() * total);
            let num = 1;
            for (let i = 0; i < norProEnemySuffixArr.length; i++) {
                currP -= norProEnemySuffixArr[i].value;
                if (currP < 0) {
                    this.enemys.push(new Enemy("Slime", norProEnemySuffixArr[i].key, this.enemyLv));
                    break;
                }
            }
        },
        showKnapsack () {
            this.knapsackVisible = true;
        },
        showPlayerAttr () {
            this.playerAttrVisible = true;
        },
        changeAutoFight () {
            this.autoFightFlag = !this.autoFightFlag;
            if (this.autoFightFlag && !this.inBattleFlag) {
                this.fight();
            }
            localStorage.setItem("autoFightFlag", this.autoFightFlag);
        },
        log (msg) {
            this.msgList.push(msg);
        },
        initGame () {
            localStorage.clear();
            this.player = new Player();
        }
    },
    provide () {
        return {
            log: this.log
        }
    },
    components: {
        BePlayerInfo,
        BeEnemyInfo,
        BeFightInfo,
        BeKnapsack,
        BePlayerAttr
    },
    created () {
        var fontSizeChangePage = function () {
            var p = (document.body && document.body.clientWidth || document.getElementsByTagName("html")[0].offsetWidth) / 750;
            p = p > 1 ? 1 : p < 0.427 ? 0.427 : p;
            document.getElementsByTagName("html")[0].setAttribute("style", "font-size:" + p * 100 + "px !important");  
        }
        fontSizeChangePage();
        window.addEventListener('resize', function(){
            fontSizeChangePage();
        }, false);
        if (localStorage.getItem("player")) {
            this.player = new Player(JSON.parse(localStorage.getItem("player")));
        } else {
            this.player = new Player();
        }
        if (localStorage.getItem("equips")) {
            let lsEquips = JSON.parse(localStorage.getItem("equips"));
            Object.keys(lsEquips).forEach(key => {
                if (lsEquips[key]) {
                    let o = deepCopy(lsEquips[key]);
                    o.accordingToId = false;
                    lsEquips[key] = new Equip(o);
                }
            })
            this.player.equips = lsEquips;
        }
        if (localStorage.getItem("knapsack")) {
            let lsKnapsack = JSON.parse(localStorage.getItem("knapsack"));
            let arr = lsKnapsack.map(item => {
                item.accordingToId = false;
                return new Equip(item);
            })
            this.player.knapsack = arr;
        }
        this.autoFightFlag = (localStorage.getItem("autoFightFlag") && localStorage.getItem("autoFightFlag") !== "false") || false;
        this.enemyLv = localStorage.getItem("enemyLv") ? +localStorage.getItem("enemyLv") : 1;
        this.enemyNum = localStorage.getItem("enemyNum") ? +localStorage.getItem("enemyNum") : 1;
        this.createEnemys();
    }
}
</script>

<style lang="scss">
    body,div,ul,ol,li,dl,h1,h2,h3,h4,h5,h6,button,input{
        vertical-align: top;
        margin: 0;
        padding: 0;
    }
    #app{
        position: absolute;
        left: 50%;
        margin-left: -3.75rem;
        top: 0;
        width: 7.5rem;
        height: 100%;
        max-width: 100%;
        box-sizing:border-box;
        padding: 0.1rem;
        box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.7);
        .button-group{
            padding: 0.1rem;
            width: 100%;
            height: calc(25% - 0.1rem);
            margin-bottom: 0.1rem;
            font-size: 0.24rem;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid $black;
        }
    }
    button{
        padding: 1px 0.06rem;
        font-size: 0.24rem;
        background-color: $white;
        border: 1px solid $gray;
    }
    .fl{
        float: left;
    }             
    .fr{
        float: right;
    }      
    .clearfix{
        zoom: 1;
        &:after{
            content: "";
            clear: both;
            display: block;
        }
    }
</style>
