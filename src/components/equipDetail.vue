<template>
  <div class="equip-detail" v-if="equip">
    <div class="base-info">
      <dl>
        <span :style="'color: ' + equip.getColor()">
          {{ equip.getName() }} (lv: {{ equip.lv }})
        </span>
        <span class="red-text" v-if="equip.strengthenLv > 0">
          +{{ equip.strengthenLv }}
        </span>
      </dl>
      <dl v-if="powerUp">
        战斗力增幅：
        <template>
          <span class="red-text" v-if="+powerUp > 0">{{ powerUp }}</span>
          <span class="green-text" v-else>{{ powerUp }}</span>
        </template>
      </dl>
      <dl v-for="(attr, i) in equip.getBaseInfo()" :key="i">
        {{ attr.name }}：{{ attr.value }}
        <span class="round" v-if="attr.round">
          ({{ attr.round.join(' - ') }})
        </span>

        <span class="red-text" v-if="equip.strengthenLv > 0">
          ({{ attr.strengthenAttr }})
        </span>
      </dl>
    </div>
    <div
      class="extra-info"
      v-if="equip.extraAttr && equip.extraAttr.length > 0"
    >
      <dl v-for="(attr, i) in equip.extraAttr" :key="i">
        {{ attr.type.name }}：{{ attr.value + attr.type.suffix }}
      </dl>
    </div>
    <button @click="strengthen($event)">
      强化<small>({{ equip.getStrengthenPrice() }})</small>
    </button>
    <button @click="burnish($event)">
      打磨<small>({{ equip.getBurnishPrice() }})</small>
    </button>
    <button @click="equipFn($event)" v-show="btnType === 'equip'">装备</button>
    <button @click="unloadEquip($event)" v-show="btnType === 'unload'">
      卸下
    </button>
    <button
      @click="sale($event)"
      v-show="btnType === 'equip' && !equip.lockFlag"
    >
      出售<small>({{ equip.price }})</small>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    equip: Object,
    btnType: {
      type: String,
      default: 'equip',
    },
    powerUp: String,
  },
  methods: {
    equipFn(e) {
      e.stopPropagation();
      this.$emit('equip');
    },
    unloadEquip(e) {
      e.stopPropagation();
      this.$emit('unload');
    },
    strengthen(e) {
      e.stopPropagation();
      this.$emit('strengthen', this.equip);
    },
    burnish(e) {
      e.stopPropagation();
      this.$emit('burnish', this.equip);
    },
    sale(e) {
      e.stopPropagation();
      this.$emit('sale', this.equip);
    },
  },
};
</script>

<style lang="scss" scoped>
.equip-detail {
  margin: 0 auto;
  width: 6rem;
  box-sizing: border-box;
  padding: 0.2rem 0.4rem;
  font-size: 0.24rem;
  background-color: $white;

  dl {
    line-height: 0.36rem;

    .round {
      color: $gray;
    }

    .red-text {
      color: $red;
    }

    .green-text {
      color: $green;
    }
  }

  .base-info {
    padding-bottom: 0.2rem;
  }

  .extra-info {
    border-top: 1px solid $black;
    padding-top: 0.2rem;
    margin-bottom: 0.2rem;
  }
}
</style>
