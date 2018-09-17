<template>
    <div id="app">
        <be-player-info :player="player"></be-player-info>
        <be-enemy-info :enemys="enemys"></be-enemy-info>
        <div class="button-group">
            <div class="fl button-group-left">
                <button @click="showKnapsack">背包</button>
                <button @click="showPlayerAttr">属性</button>
                <button @click="changeAutoFight">{{autoFightFlag ? '关闭自动' : '自动战斗'}}</button>
                <button @click="initGame">重新开始</button>
            </div>
            <div class="fr button-group-right">
                怪物等级：{{enemyLv}}<br/>
                怪物进度：{{enemyNum}} / {{enemyNumMax}}
            </div>
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
import { deepCopy, millisecondFmt } from '@/utils/util';
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
            enemyNum: 0,
            enemyNumMax: 10,
            enemyStos: [],
            playerSto: null,
            onHookEnemyLv: "Puniness",
            onHookProfitMultipleRate: 1
        }
    },
    methods: {
        clearSto () {
            clearTimeout(this.playerSto);
            this.enemyStos.forEach(sto => {
                clearTimeout(sto);
            });
        },
        fight () {
            this.inBattleFlag = true;
            let currEnemyIdx = 0;
            let playerAtkFn = () => {
                var ch = this.player.attack(this.enemys[currEnemyIdx]);
                if (ch.msg) {
                    this.log(ch.msg);
                }
                if (ch.currHp === 0) {
                    currEnemyIdx++;
                    if (currEnemyIdx < this.enemys.length) {
                        this.playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed)
                    } else {
                        this.clearSto();
                        this.victory();
                    }
                } else {
                    this.playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed);
                }
            }
            this.playerSto = setTimeout(playerAtkFn, this.player.interval * 1000 / this.gameSpeed);
            let enemyAtkFn = (i) => {
                var ch = this.enemys[i].attack(this.player);
                if (ch.msg) {
                    this.log(ch.msg);
                }
                if (ch.currHp === 0) {
                    this.clearSto();
                    this.loss();
                } else {
                    clearTimeout(this.enemyStos[i]);
                    this.enemyStos[i] = setTimeout(() => {
                        enemyAtkFn(i);
                    }, this.enemys[i].interval * 1000 / this.gameSpeed)
                }
            }
            this.enemys.forEach((enemy, i) => {
                this.enemyStos[i] = setTimeout(() => {
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
        saveTime () {
            localStorage.setItem("saveTime", new Date().getTime());
        },
        loss () {
            this.saveTime();
            this.log("战斗失败");
            if (this.enemyNum > 0) {
                this.enemyNum--;
            } else if (this.enemyLv > 1) {
                this.enemyLv--;
                this.enemyNum = this.enemyNumMax - 1;
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
            this.saveTime();
            this.log("战斗胜利");
            this.fallDownEquipment();
            this.getExp();
            if (this.enemyNum < this.enemyNumMax - 1) {
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
            this.isMinStatus();
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
            this.clearSto();
            this.enemyLv = 1;
            this.enemyNum = 0;
            this.player = new Player();
            this.createEnemys();
        },
        calculationOnHookProfit () {
            let now = new Date().getTime();
            let later = +localStorage.getItem("saveTime");
            localStorage.setItem("saveTime", now);
            let enemy = new Enemy("Slime", this.onHookEnemyLv, this.enemyLv);
            let damage = this.player.getOnHookDamage(enemy);
            let enemyDamage = enemy.getOnHookDamage(this.player);
            let time1 = Math.floor(enemy.hp / damage) * 2000 / this.onHookProfitMultipleRate * this.player.interval;
            let enemyDamageTotal = Math.floor(time1 / enemy.interval) / 2000 * enemyDamage;
            let time2 = Math.floor((enemyDamageTotal > this.player.hp ? 100 : enemyDamageTotal / this.player.hp * 100) / this.recoverySpeed * 1000);
            let num = Math.floor((now - later) / (time1 + time2));
            let equips = [];
            let exp = 0;
            for (let i = 0; i < num; i++) {
                equips.push(enemy.fallDownEquipment());
                exp += enemy.exp;
            }
            this.player.getEquips(equips);
            this.player.getExp(exp);
            this.log(`挂机 ${millisecondFmt(now - later)}, 共获得 ${equips.length} 件装备, 经验 ${exp}`);
        },
        isMinStatus() {
            var isMin = false;
                if (window.outerWidth != undefined) {
                isMin = window.outerWidth <= 160 && window.outerHeight <= 27;
            }
            else {
                isMin = window.screenTop < -30000 && window.screenLeft < -30000;
            }
            return isMin;
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
        // this.autoFightFlag = (localStorage.getItem("autoFightFlag") && localStorage.getItem("autoFightFlag") !== "false") || false;
        this.enemyLv = localStorage.getItem("enemyLv") ? +localStorage.getItem("enemyLv") : 1;
        this.enemyNum = localStorage.getItem("enemyNum") ? +localStorage.getItem("enemyNum") : 0;
        this.player.receiveMsg(msg => {
            this.log(msg);
        })
        this.calculationOnHookProfit();
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
            font-size: 0.32rem;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid $black;
            .button-group-left{
                width: 60%;
                button{
                    width: 1.3rem;
                    height: 0.4rem;
                    line-height: 0.4rem;
                    text-align: center;
                    margin: 0.06rem;
                }
            }
            .button-group-right{
                width: 40%;
            }
        }
    }
    button{
        height: 0.4rem;
        box-sizing: border-box;
        padding: 0 0.06rem;
        font-size: 0.28rem;
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
