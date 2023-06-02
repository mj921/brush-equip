<template>
  <div id="app">
    <be-player-info :player="player"></be-player-info>
    <be-enemy-info :enemys="enemys"></be-enemy-info>
    <div class="button-group">
      <div class="fl button-group-left">
        <button @click="showKnapsack">背包</button>
        <button @click="showPlayerAttr">属性</button>
        <button @click="showSkill">技能</button>
        <button @click="changeAutoFight">
          {{ autoFightFlag ? '关闭自动' : '自动战斗' }}
        </button>
        <button @click="initGame">重新开始</button>
        <button @click="simulationFight" v-if="env === 'development'">
          模拟战斗
        </button>
        <button @click="showStatistics">统计</button>
        <button @click="showSetting">设置</button>
      </div>
      <div class="fr button-group-right">
        怪物等级：{{ enemyLv }}<br />
        怪物进度：{{ enemyNum }} / {{ enemyNumMax }}
      </div>
    </div>
    <be-fight-info :msgList="msgList"></be-fight-info>
    <be-knapsack :player="player" :visible.sync="knapsackVisible"></be-knapsack>
    <be-player-attr
      :player="player"
      :visible.sync="playerAttrVisible"
    ></be-player-attr>
    <be-setting
      :visible.sync="settingVisible"
      :saleEquipRule.sync="saleEquipRule"
    ></be-setting>
    <be-statistics
      :visible.sync="statisticsVisible"
      :kill-enemy-suffix-num="killEnemySuffixNum"
      :kill-enemy-type-num="killEnemyTypeNum"
      :equip-quality-fall-down-num="equipQualityFallDownNum"
      :equip-type-fall-down-num="equipTypeFallDownNum"
    ></be-statistics>
    <be-skill-info
      :player="player"
      :visible.sync="skillVisible"
    ></be-skill-info>
    <template v-if="env === 'development'">
      <be-simulation-fight
        :visible.sync="simulationVisible"
      ></be-simulation-fight>
    </template>
  </div>
</template>

<script>
import Enemy from '@/utils/enemy';
import Player from '@/utils/player';
import Equip from '@/utils/equip';
import Skill from '@/utils/skill';
import EnemyData from '@/utils/enemyData';
import BePlayerInfo from '@/components/player-info.vue';
import BeEnemyInfo from '@/components/enemy-info.vue';
import BeFightInfo from '@/components/fight-info.vue';
import BeKnapsack from '@/components/knapsack.vue';
import BePlayerAttr from '@/components/playerAttr.vue';
import BeSetting from '@/components/setting.vue';
import BeStatistics from '@/components/statistics.vue';
import BeSkillInfo from '@/components/skill-info.vue';
import { EquipQuality, EquipType, Suffix } from '@/utils/data';
import { createEnemys } from '@/utils/app';
import { deepCopy, millisecondFmt } from '@/utils/util';

let BeSimulationFight = null;
if (process.env.NODE_ENV === 'development') {
  BeSimulationFight = require('@/components/simulation-fight.vue').default;
}

export default {
  name: 'App',
  data() {
    return {
      player: null,
      enemys: [],
      gameSpeed: 10,
      recoverySpeed: 2, // 每0.1s恢复最大生命值百分比
      autoFightFlag: false,
      inBattleFlag: false,
      knapsackVisible: false,
      playerAttrVisible: false,
      settingVisible: false,
      statisticsVisible: false,
      msgList: [], // 面板信息列表
      enemyLv: 1, // 当前怪物等级
      enemyNum: 0, // 当前级别怪物进度
      enemyNumMax: 10, // 每个级别怪物数量
      enemyStos: [], // 怪物战斗定时器
      playerSto: null, // 玩家战斗定时器
      onHookEnemyLv: 'Puniness', // 离线怪物词缀
      onHookProfitMultipleRate: 1, // 离线收益倍率
      saleEquipRule: '', // 自动出售设置
      killEnemySuffixNum: {},
      killEnemyTypeNum: {},
      equipTypeFallDownNum: {},
      equipQualityFallDownNum: {},
      maxEnemyLv: 1,
      simulationVisible: false,
      skillVisible: false,
      env: process.env.NODE_ENV,
    };
  },
  methods: {
    clearSto() {
      clearTimeout(this.playerSto);
      this.enemyStos.forEach((sto) => {
        clearTimeout(sto);
      });
    },
    // 战斗
    fight() {
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
            this.playerSto = setTimeout(
              playerAtkFn,
              (this.player.interval * 1000) / this.gameSpeed
            );
          } else {
            this.clearSto();
            this.victory();
          }
        } else {
          this.playerSto = setTimeout(
            playerAtkFn,
            (this.player.interval * 1000) / this.gameSpeed
          );
        }
      };
      this.playerSto = setTimeout(
        playerAtkFn,
        (this.player.interval * 1000) / this.gameSpeed
      );
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
          }, (this.enemys[i].interval * 1000) / this.gameSpeed);
        }
      };
      this.enemys.forEach((enemy, i) => {
        this.enemyStos[i] = setTimeout(() => {
          enemyAtkFn(i);
        }, (enemy.interval * 1000) / this.gameSpeed);
      });
    },
    // 掉落
    fallDownEquipment() {
      let equips = [];
      this.enemys.forEach((enemy) => {
        equips.push(enemy.fallDownEquipment());
      });
      this.log(
        `获得 ${equips
          .map(
            (equip) =>
              '<span style="color: ' +
              equip.equipQuality.color +
              '">' +
              equip.getName() +
              '</span>'
          )
          .join('、')}`
      );
      this.autoSaleEquips(equips);
    },
    // 获得经验
    getExp() {
      let exp = 0;
      this.enemys.forEach((enemy) => {
        exp += enemy.exp;
      });
      this.player.getExp(exp);
    },
    // 保存当前时间戳
    saveTime() {
      localStorage.setItem('saveTime', new Date().getTime());
    },
    // 战斗失败
    loss() {
      this.saveTime();
      this.log('战斗失败');
      if (this.enemyNum > 0) {
        this.enemyNum--;
      } else if (this.enemyLv > 1) {
        this.enemyLv--;
        this.enemyNum = this.enemyNumMax - 1;
      } else {
        this.enemyLv = 1;
        this.enemyNum = 0;
      }
      localStorage.setItem('enemyLv', this.enemyLv);
      localStorage.setItem('enemyNum', this.enemyNum);
      this.player.autoRcoveryHp(this.recoverySpeed, () => {
        this.createEnemys();
        this.inBattleFlag = false;
      });
    },
    // 战斗胜利
    victory() {
      this.saveTime();
      this.log('战斗胜利');
      this.fallDownEquipment();
      this.getExp();
      if (this.enemyNum < this.enemyNumMax - 1) {
        this.enemyNum++;
      } else {
        this.enemyLv++;
        this.enemyNum = 0;
        if (this.enemyLv > this.maxEnemyLv) {
          this.maxEnemyLv = this.enemyLv;
          localStorage.setItem('maxEnemyLv', this.maxEnemyLv);
        }
      }
      this.enemys.forEach((enemy) => {
        this.killEnemySuffixNum[enemy.suffix]++;
        this.killEnemyTypeNum[enemy.enemyType]++;
      });
      localStorage.setItem(
        'killEnemySuffixNum',
        JSON.stringify(this.killEnemySuffixNum)
      );
      localStorage.setItem(
        'killEnemyTypeNum',
        JSON.stringify(this.killEnemyTypeNum)
      );
      localStorage.setItem('enemyLv', this.enemyLv);
      localStorage.setItem('enemyNum', this.enemyNum);
      this.player.autoRcoveryHp(this.recoverySpeed, () => {
        this.createEnemys();
        this.inBattleFlag = false;
      });
    },
    // 创建多个怪物
    createEnemys() {
      this.enemys = createEnemys(this.enemyNum, this.enemyNumMax, this.enemyLv);
      if (this.autoFightFlag) {
        this.fight();
      }
    },
    showKnapsack() {
      this.knapsackVisible = true;
    },
    showPlayerAttr() {
      this.playerAttrVisible = true;
    },
    showSkill() {
      this.skillVisible = true;
    },
    // 切换自动战斗
    changeAutoFight() {
      this.autoFightFlag = !this.autoFightFlag;
      if (this.autoFightFlag && !this.inBattleFlag) {
        this.fight();
      }
      localStorage.setItem('autoFightFlag', this.autoFightFlag);
    },
    // 向消息面板添加信息
    log(msg) {
      this.msgList.push(msg);
      this.msgList = this.msgList.slice(-1000);
    },
    // 初始化游戏
    initGame() {
      localStorage.clear();
      this.clearSto();
      this.enemyLv = 1;
      this.enemyNum = 0;
      this.player = new Player();
      this.createEnemys();
      this.saleEquipRule = '';
      this.killEnemySuffixNum = (() => {
        let obj = {};
        Object.keys(Suffix).forEach((key) => {
          obj[key] = 0;
        });
        return obj;
      })();
      this.killEnemyTypeNum = (() => {
        let obj = {};
        Object.keys(EnemyData).forEach((key) => {
          obj[key] = 0;
        });
        return obj;
      })();

      this.equipQualityFallDownNum = (() => {
        let obj = {};
        Object.keys(EquipQuality).forEach((key) => {
          obj[key] = 0;
        });
        return obj;
      })();

      this.equipTypeFallDownNum = (() => {
        let obj = {};
        Object.keys(EquipType).forEach((key) => {
          obj[key] = 0;
        });
        return obj;
      })();
      this.maxEnemyLv = 1;
    },
    autoSaleEquips(equips) {
      equips.forEach((equip) => {
        this.equipTypeFallDownNum[equip.type]++;
        this.equipQualityFallDownNum[equip.quality]++;
      });
      localStorage.setItem(
        'equipTypeFallDownNum',
        JSON.stringify(this.equipTypeFallDownNum)
      );
      localStorage.setItem(
        'equipQualityFallDownNum',
        JSON.stringify(this.equipQualityFallDownNum)
      );
      let goldCoinFilter = 0;
      let saleNumFilter = 0;
      let es = equips;
      if (this.saleEquipRule) {
        if (this.saleEquipRule === 'auto') {
          es = equips.filter((equip) => {
            if (
              this.player.getCurrEquipPower(equip) >
              this.player.getCombatPower()
            ) {
              return true;
            } else {
              goldCoinFilter += equip.price;
              saleNumFilter++;
              return false;
            }
          });
        } else {
          let qualityKeys = Object.keys(EquipQuality);
          qualityKeys = qualityKeys.slice(
            qualityKeys.indexOf(this.saleEquipRule)
          );
          es = equips.filter((equip) => {
            if (qualityKeys.includes(equip.type)) {
              return true;
            } else {
              goldCoinFilter += equip.price;
              saleNumFilter++;
              return false;
            }
          });
        }
      }
      this.player.getGoldCoin(goldCoinFilter);
      const { goldCoin, saleNum } = this.player.getEquips(es);
      if (saleNum + saleNumFilter > 0) {
        this.log(
          `出售 ${saleNum + saleNumFilter} 件装备, 共获得 ${
            goldCoin + goldCoinFilter
          } 金币`
        );
      }
    },
    // 计算离线收益
    calculationOnHookProfit() {
      let now = new Date().getTime();
      let later = +localStorage.getItem('saveTime') || now;
      localStorage.setItem('saveTime', now);
      let enemy = new Enemy('Slime', this.onHookEnemyLv, this.enemyLv);
      let damage = this.player.getOnHookDamage(enemy);
      let enemyDamage = enemy.getOnHookDamage(this.player);
      let time1 =
        ((Math.floor(enemy.hp / damage) * 2000) /
          this.onHookProfitMultipleRate) *
        this.player.interval;
      let enemyDamageTotal =
        (Math.floor(time1 / enemy.interval) / 2000) * enemyDamage;
      let time2 = Math.floor(
        ((enemyDamageTotal > this.player.hp
          ? 100
          : (enemyDamageTotal / this.player.hp) * 100) /
          this.recoverySpeed) *
          1000
      );
      let num = Math.floor((now - later) / (time1 + time2));
      let equips = [];
      let exp = 0;
      for (let i = 0; i < num; i++) {
        equips.push(enemy.fallDownEquipment());
        exp += enemy.exp;
      }
      this.autoSaleEquips(equips);
      this.player.getExp(exp);
      this.log(
        `挂机 ${millisecondFmt(now - later)}, 共获得 ${
          equips.length
        } 件装备, 经验 ${exp}`
      );
    },
    showStatistics() {
      this.statisticsVisible = true;
    },
    showSetting() {
      this.settingVisible = true;
    },
    simulationFight() {
      this.simulationVisible = true;
    },
  },
  provide() {
    return {
      log: this.log,
    };
  },
  components: {
    BePlayerInfo,
    BeEnemyInfo,
    BeFightInfo,
    BeKnapsack,
    BePlayerAttr,
    BeSetting,
    BeSimulationFight,
    BeSkillInfo,
    BeStatistics,
  },
  mounted() {
    this.calculationOnHookProfit();
    this.createEnemys();
  },
  created() {
    var fontSizeChangePage = function () {
      var p =
        ((document.body && document.body.clientWidth) ||
          document.getElementsByTagName('html')[0].offsetWidth) / 750;
      p = p > 1 ? 1 : p < 0.427 ? 0.427 : p;
      document
        .getElementsByTagName('html')[0]
        .setAttribute('style', 'font-size:' + p * 100 + 'px !important');
    };
    fontSizeChangePage();
    window.addEventListener(
      'resize',
      function () {
        fontSizeChangePage();
      },
      false
    );
    if (localStorage.getItem('player')) {
      this.player = new Player(JSON.parse(localStorage.getItem('player')));
    } else {
      this.player = new Player();
    }
    if (localStorage.getItem('equips')) {
      let lsEquips = JSON.parse(localStorage.getItem('equips'));
      Object.keys(lsEquips).forEach((key) => {
        if (lsEquips[key]) {
          let o = deepCopy(lsEquips[key]);
          o.accordingToId = false;
          lsEquips[key] = new Equip(o);
        }
      });
      this.player.equips = lsEquips;
    }
    if (localStorage.getItem('knapsack')) {
      let lsKnapsack = JSON.parse(localStorage.getItem('knapsack'));
      let arr = lsKnapsack.map((item) => {
        item.accordingToId = false;
        return new Equip(item);
      });
      this.player.knapsack = arr;
    }
    if (
      localStorage.getItem('baseSkill') &&
      localStorage.getItem('baseSkill') !== 'null'
    ) {
      let lsSkill = JSON.parse(localStorage.getItem('baseSkill'));
      this.player.baseSkill = new Skill(lsSkill);
    }
    // this.autoFightFlag = (localStorage.getItem("autoFightFlag") && localStorage.getItem("autoFightFlag") !== "false") || false;
    this.enemyLv = localStorage.getItem('enemyLv')
      ? +localStorage.getItem('enemyLv')
      : 1;
    this.enemyNum = localStorage.getItem('enemyNum')
      ? +localStorage.getItem('enemyNum')
      : 0;
    // 接收player的消息
    this.player.receiveMsg((msg) => {
      this.log(msg);
    });
    this.saleEquipRule = localStorage.getItem('saleEquipRule') || '';
    this.killEnemySuffixNum = localStorage.getItem('killEnemySuffixNum')
      ? JSON.parse(localStorage.getItem('killEnemySuffixNum'))
      : (() => {
          let obj = {};
          Object.keys(Suffix).forEach((key) => {
            obj[key] = 0;
          });
          return obj;
        })();
    this.killEnemyTypeNum = localStorage.getItem('killEnemyTypeNum')
      ? JSON.parse(localStorage.getItem('killEnemyTypeNum'))
      : (() => {
          let obj = {};
          Object.keys(EnemyData).forEach((key) => {
            obj[key] = 0;
          });
          return obj;
        })();
    this.equipQualityFallDownNum = localStorage.getItem(
      'equipQualityFallDownNum'
    )
      ? JSON.parse(localStorage.getItem('equipQualityFallDownNum'))
      : (() => {
          let obj = {};
          Object.keys(EquipQuality).forEach((key) => {
            obj[key] = 0;
          });
          return obj;
        })();

    this.equipTypeFallDownNum = localStorage.getItem('equipTypeFallDownNum')
      ? JSON.parse(localStorage.getItem('equipTypeFallDownNum'))
      : (() => {
          let obj = {};
          Object.keys(EquipType).forEach((key) => {
            obj[key] = 0;
          });
          return obj;
        })();
    this.maxEnemyLv = localStorage.getItem('maxEnemyLv')
      ? +localStorage.getItem('maxEnemyLv')
      : 1;
  },
};
</script>

<style lang="scss">
body,
div,
ul,
ol,
li,
dl,
h1,
h2,
h3,
h4,
h5,
h6,
button,
input {
  vertical-align: top;
  margin: 0;
  padding: 0;
}
#app {
  position: absolute;
  left: 50%;
  margin-left: -3.75rem;
  top: 0;
  width: 7.5rem;
  height: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.1rem;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.7);
  .button-group {
    padding: 0.1rem;
    width: 100%;
    height: calc(25% - 0.1rem);
    margin-bottom: 0.1rem;
    font-size: 0.32rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid $black;
    .button-group-left {
      width: 60%;
      button {
        width: 1.3rem;
        height: 0.4rem;
        line-height: 0.4rem;
        text-align: center;
        margin: 0.06rem;
      }
    }
    .button-group-right {
      width: 40%;
    }
  }
}
button {
  height: 0.4rem;
  box-sizing: border-box;
  padding: 0 0.06rem;
  font-size: 0.28rem;
  background-color: $white;
  border: 1px solid $gray;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix {
  zoom: 1;
  &:after {
    content: '';
    clear: both;
    display: block;
  }
}
</style>
