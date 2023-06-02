<template>
  <div class="button-group">
    <button @click="showKnapsack">背包</button>
    <button @click="showPlayerAttr">属性</button>
  </div>
</template>

<script>
export default {
  inject: ['showKnapsack', 'showPlayerAttr'],
};
</script>

<style lang="scss" scoped>
.button-group {
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
</style>
