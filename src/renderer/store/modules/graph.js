const state = {
  graphRenderCount: 0,
};

const mutations = {
  incrementGraphRenderCount(state) {
    state.graphRenderCount += 1;
  },
};

export default {
  state,
  mutations,
};
