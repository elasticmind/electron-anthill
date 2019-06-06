import * as transformUtils from '../../../utils/transform';

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
      min: NaN,
      max: NaN,
    },
  },
  options: {
    category: [],
    subcategory: [],
    channel: [],
    timestamp: {
      min: NaN,
      max: NaN,
    },
  },
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
    // const subcategoryFilter = generateInclusionFilter('subcategory');
    // const channelFilter = generateInclusionFilter('channel');
    // const timestampFilter = generateRangeFilter('timestamp');

    const composedFilter = (event) => {
      return categoryFilter(event);
      /* && subcategoryFilter(event)
          && channelFilter(event)
          && timestampFilter(event);*/
    };

    return state.events.filter(composedFilter);
  },
  graph(state) {
    return transformUtils.getSimplifiedData(state.selectedEvents);
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
  updateFilterToggle(state, {filterToggle, value}) {
    state.filterToggles[filterToggle] = value;
  },
  updateFilterValue(state, {filterValue, value}) {
    state.filterValues[filterValue] = value;
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
