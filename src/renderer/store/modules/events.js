import Vue from 'vue';

const state = {
  history: {},
};

const mutations = {
  add(state, {source, ...rest}) {
    if (!state.history[source]) {
      Vue.set(state.history, source, []);
    }
    state.history[source].push(rest);
  },
};

const actions = {
  add({commit, state}, event) {
    commit('add', event);
  },
  addBulk({commit, state}, events) {
    events.forEach((event) => commit('add', event));
  },
};

export default {
  state,
  mutations,
  actions,
};
