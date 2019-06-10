import Vue from 'vue';
import Vuex from 'vuex';
import * as transformUtils from '../../utils/transform';

Vue.use(Vuex);

const state = {
  events: [],
  selectedEvents: [],
  filterToggles: {
    'category': false,
    'subcategory': false,
    'channel': false,
    'timestamp': false,
  },
  filterValues: {
    category: [],
    subcategory: [],
    channel: [],
    timestamp: {
      min: 0,
      max: 0,
    },
  },
  options: {
    category: [],
    subcategory: [],
    channel: [],
    timestamp: {
      min: 0,
      max: 0,
    },
  },
  graphRenderCount: 0,
  visualizeSelectionOnly: false,
};

const getters = {
  filteredEvents(state) {
    const trueFunction = () => true;
    const generateInclusionFilter = (key) => {
      return state.filterToggles[key]
        ? (event) => state.filterValues[key].includes(event[key])
        : trueFunction;
    };
    const generateRangeFilter = (key) => {
      return state.filterToggles[key]
        ? (event) => state.filterValues[key].min <= event[key] && event[key] <= state.filterValues[key].max
        : trueFunction;
    };

    const categoryFilter = generateInclusionFilter('category');
    const subcategoryFilter = generateInclusionFilter('subcategory');
    const channelFilter = generateInclusionFilter('channel');
    const timestampFilter = generateRangeFilter('timestamp');

    const composedFilter = (event) => {
      return categoryFilter(event)
          && subcategoryFilter(event)
          && channelFilter(event)
          && timestampFilter(event);
    };

    return state.events.filter(composedFilter);
  },
  graph(state, getters, rootState) {
    return transformUtils.getSimplifiedData(rootState.visualizeSelectionOnly ? state.selectedEvents : getters.filteredEvents);
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

    function unique(array) {
      return [...(new Set(array))];
    }
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
    state.filterValues.timestamp.min = timestamp;
  },
  setSelectedMax(state, timestamp) {
    state.filterValues.timestamp.max = timestamp;
  },
  updateFilterToggle(state, {filterToggle, value}) {
    state.filterToggles[filterToggle] = value;
  },
  updateFilterValue(state, {filterValue, value}) {
    state.filterValues[filterValue] = value;
  },
  incrementGraphRenderCount(state) {
    state.graphRenderCount += 1;
  },
  setVisualizeSelectionOnly(state, flag) {
    state.visualizeSelectionOnly = flag;
  },
};

const actions = {
  addBulk({commit}, events) {
    events.forEach((event) => commit('add', event));
    commit('recalculateOptions');
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production',
});
