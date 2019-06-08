const state = {
  graphRenderCount: 0,
  visualizeSelectionOnly: false,
};

const mutations = {
  incrementGraphRenderCount(state) {
    state.graphRenderCount += 1;
  },
  setVisualizeSelectionOnly(state, flag) {
    state.visualizeSelectionOnly = flag;
  },
};

export default {
  state,
  mutations,
};
