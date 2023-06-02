<template>
  <div class="knapsack" v-show="visible">
    <div class="container">
      <div class="already-equipped">
        <dl>
          <template v-if="player.baseSkill">
            <span @click="showSkillDetail(player.baseSkill)">{{
              player.baseSkill.name
            }}</span>
            <button @click="unloadBaseSkill()">卸下</button>
          </template>
          <span v-else>未装备技能</span>
        </dl>
      </div>
      <div class="not-equip">
        <template v-for="(skill, i) in baseSkills">
          <dl
            :key="i"
            v-if="!player.baseSkill || skill.code !== player.baseSkill.code"
          >
            <span @click="showSkillDetail(skill)">{{ skill.name }}</span>
            <div class="btn-group">
              <button @click="equipBaseSkill(skill)">装备</button>
            </div>
          </dl>
        </template>
      </div>
      <div class="knapsack-bottom clearfix">
        <div class="fr">
          <button @click="close">关闭</button>
        </div>
      </div>
      <div class="equip-info" v-show="detailVisible" @click="closeDetail">
        <div class="skill-detail">
          {{ skill && skill.getDescribe() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BaseSkillData } from '@/utils/skillData';
import Skill from '@/utils/skill';
export default {
  data() {
    return {
      detailVisible: false,
      skill: null,
      baseSkills: [],
    };
  },
  props: {
    player: Object,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['log'],
  methods: {
    showSkillDetail(skill) {
      this.detailVisible = true;
      this.skill = skill;
    },
    closeDetail() {
      this.detailVisible = false;
    },
    close() {
      this.$emit('update:visible', false);
    },
    equipBaseSkill(skill) {
      this.player.equipBaseSkill(skill);
      this.detailVisible = false;
    },
    unloadBaseSkill() {
      this.player.unloadBaseSkill();
      this.detailVisible = false;
    },
    stopProp(e) {
      e.stopPropagation();
    },
  },
  created() {
    this.baseSkills = Object.keys(BaseSkillData).map((key) => {
      return new Skill(BaseSkillData[key]);
    });
  },
};
</script>

<style lang="scss" scoped>
.knapsack {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $maskColor;
  .container {
    margin: 0.1rem;
    width: calc(100% - 0.2rem);
    height: calc(100% - 0.2rem);
    background-color: $white;
    .already-equipped {
      margin-bottom: 0.1rem;
      height: 4.05rem;
      padding: 0.1rem;
      border-bottom: 1px solid $black;
      dl {
        padding: 0 0.2rem;
        height: 0.45rem;
        font-size: 0.32rem;
        line-height: 0.45rem;
        span {
          float: left;
        }
        button {
          float: right;
          height: 0.4rem;
        }
      }
    }
    .not-equip {
      height: calc(100% - 5.45rem);
      padding: 0.1rem;
      border-bottom: 1px solid $black;
      overflow: auto;
      dl {
        padding: 0 0.2rem;
        height: 0.45rem;
        font-size: 0.32rem;
        line-height: 0.45rem;
        span {
          float: left;
          &.red-text {
            color: $red;
            margin-left: 0.2rem;
          }
          &.green-text {
            color: $green;
            margin-left: 0.2rem;
          }
        }
        .btn-group {
          float: right;
          button {
            height: 0.4rem;
          }
        }
      }
    }
    .equip-info {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 0.4rem 0;
      background-color: $maskColor;
    }
    .knapsack-bottom {
      padding: 0.2rem;
    }
  }
  .skill-detail {
    margin: 30% 0.5rem;
    padding: 0.2rem;
    background-color: $white;
    font-size: 0.32rem;
  }
}
</style>
