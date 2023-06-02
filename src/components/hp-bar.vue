<template>
  <div class="hp-bar" :style="style">
    <div
      class="curr-progress"
      :class="{ exp: type === 'exp' }"
      :style="currStyle"
    ></div>
    <div class="bp-info">{{ curr }} / {{ max }}</div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '4rem',
    },
    max: {
      type: Number,
      default: 0,
    },
    curr: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'hp',
    },
  },
  computed: {
    style() {
      return {
        width: this.width,
      };
    },
    currStyle() {
      return {
        width:
          (this.max > 0 ? (this.curr / this.max) * 100 : 0).toFixed(2) + '%',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.hp-bar {
  display: inline-block;
  position: relative;
  height: 0.3rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid $black;
  .curr-progress {
    height: 100%;
    background-color: $red;
    &.exp {
      background-color: $violet;
    }
  }
  .bp-info {
    position: absolute;
    top: 0;
    left: 0;
    line-height: 0.3rem;
    height: 0.3rem;
    width: 100%;
    text-align: center;
    color: $black;
    font-size: 0.24rem;
  }
}
</style>
