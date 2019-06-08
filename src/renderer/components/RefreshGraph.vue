<template>
  <div>
    <button class="button" @click="refreshGraph">Refresh Graph</button>
    <label for="visualize-selection-only">
      <input id="visualize-selection-only" type="checkbox" v-model="visualizeSelectionOnly"/>
      <span class="key">Visualize selection only</span>
    </label>
  </div>
</template>

<script>
export default {
  methods: {
    refreshGraph() {
      this.$store.commit('incrementGraphRenderCount');
    },
  },
  computed: {
    visualizeSelectionOnly: {
      set(flag) {
        this.$store.commit('setVisualizeSelectionOnly', flag);
      },
      get() {
        return this.$store.state.refreshGraph.visualizeSelectionOnly;
      },
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
  background-color: hsl(210, 97%, 45%);
  color: rgb(250, 250, 250);
  padding: 10px 30px;
  margin: 0 auto 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    background-color: hsl(210, 97%, 55%);
  }
}

.key {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>

