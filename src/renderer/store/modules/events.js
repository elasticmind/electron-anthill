import * as transformUtils from '../../../utils/transform';

const state = {
  events: [],
  selectedEvents: [],
  filterToggle: false,
  selectedChannel: [],
  selectedMin: 0,
  selectedMax: 100,
  options: {
    channel: [],
    timestamp: {
      min: NaN,
      max: NaN,
    },
  },
};

const getters = {
  filteredEvents(state) {
    if (!state.filterToggle) {
      return state.events;
    }

    return state.events.filter((event) => {
      return state.selectedChannel.includes(event.channel)
        && state.selectedMin <= event.timestamp
        && event.timestamp <= state.selectedMax;
    });
  },
  graph(state, getters) {
    return transformUtils.getSimplifiedData(getters.selectedEvents);
  },
};

const mutations = {
  add(state, event) {
    state.events.push(event);
  },
  recalculateOptions(state) {
    state.options.category = unique(state.events.map((event) => event.category));
    state.options.subcategory = unique(state.events.map((event) => event.subcategory));
    state.options.channel = unique(state.events.map((event) => event.channel));
    const timestamps = state.events.map((event) => event.timestamp);
    state.options.timestamp.min = Math.min(...timestamps);
    state.options.timestamp.max = Math.max(...timestamps);
  },
  setSelectedEvents(state, events) {
    state.selectedEvents = events;
  },
  setFilterToggle(state, shouldFilter) {
    state.filterToggle = shouldFilter;
  },
  setSelectedChannel(state, channel) {
    state.selectedChannel = channel;
  },
  setSelectedMin(state, timestamp) {
    state.selectedMin = timestamp;
  },
  setSelectedMax(state, timestamp) {
    state.selectedMax = timestamp;
  },
};

const actions = {
  add({commit, state}, event) {
    commit('add', event);
    commit('recalculateOptions');
  },
  addBulk({dispatch}, events) {
    events.forEach((event) => dispatch('add', event));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

function unique(array) {
  return [...(new Set(array))];
}
