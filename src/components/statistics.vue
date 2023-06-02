<template>
  <div class="statistics" v-show="visible">
    <div class="container">
      <div class="main">
        <div class="sale-rule-container">
          <dl
            :key="'killEnemyTypeNum' + key"
            v-for="key in Object.keys(killEnemyTypeNum)"
          >
            <label :for="'killEnemyTypeNum' + key">{{
              enemyData[key]?.name
            }}</label>
            <span>{{ killEnemyTypeNum[key] }}</span>
          </dl>
        </div>
        <div class="sale-rule-container">
          <dl
            :key="'killEnemySuffixNum' + key"
            v-for="key in Object.keys(killEnemySuffixNum)"
          >
            <label
              :style="{ color: Suffix[key]?.color }"
              :for="'killEnemySuffixNum' + key"
              >{{ Suffix[key]?.name }}</label
            >
            <span>{{ killEnemySuffixNum[key] }}</span>
          </dl>
        </div>
        <div class="sale-rule-container">
          <dl
            :key="'equipTypeFallDownNum' + key"
            v-for="key in Object.keys(equipTypeFallDownNum)"
          >
            <label :for="'equipTypeFallDownNum' + key">{{
              EquipType[key]?.name
            }}</label>
            <span>{{ equipTypeFallDownNum[key] }}</span>
          </dl>
        </div>
        <div class="sale-rule-container">
          <dl
            :key="'equipQualityFallDownNum' + key"
            v-for="key in Object.keys(equipQualityFallDownNum)"
          >
            <label
              :style="{ color: EquipQuality[key]?.color }"
              :for="'equipQualityFallDownNum' + key"
              >{{ EquipQuality[key]?.name }}</label
            >
            <span>{{ equipQualityFallDownNum[key] }}</span>
          </dl>
        </div>
      </div>
      <div class="statistics-bottom clearfix">
        <div class="fr">
          <button @click="close">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EquipQuality, Suffix, EquipType } from '@/utils/data';
import enemyData from '@/utils/enemyData';
export default {
  data() {
    return {
      Suffix,
      enemyData,
      EquipType,
      EquipQuality,
    };
  },
  props: {
    visible: Boolean,
    killEnemyTypeNum: Object,
    killEnemySuffixNum: Object,
    equipTypeFallDownNum: Object,
    equipQualityFallDownNum: Object,
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics {
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
    box-sizing: border-box;
    padding: 0.2rem;
    overflow: auto;
    .sale-rule-container {
      margin: 0 auto;
      background-color: $white;
      width: 5rem;
      font-size: 0.28rem;
      padding: 0.4rem;
      display: grid;
      column-gap: 10px;
      row-gap: 10px;
      grid-template-columns: 1fr 1fr;
      dl {
        line-height: 0.3rem;
        display: flex;
        justify-content: space-between;
        label {
          font-size: 0.32rem;
        }
      }
    }
    .knapsack-bottom {
      padding: 0.2rem;
    }
  }
}
</style>
