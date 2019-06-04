<template>
  <button class="button" @click="refreshGraph">Refresh Graph</button>
</template>

<script>
export default {
  methods: {
    refreshGraph() {
      this.$store.commit('incrementGraphRenderCount');
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  display: block;
  border: none;
  outline: none;
  border-radius: 10px;
  background-color: rgb(37, 131, 37);
  color: rgb(250, 250, 250);
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    background-color: hsl(120, 56%, 43%);
  }
}
</style>

