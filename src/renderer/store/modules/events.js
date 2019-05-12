const state = {
  events: [],
  selectedEvent: null,
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
  graph(state) {
    function isEventUniqueAmong(events, event) {
      return !events.some((uniqueEvent) => {
        return uniqueEvent.category === event.category
          && uniqueEvent.subcategory === event.subcategory
          && uniqueEvent.channel === event.channel;
      });
    }

    function isEventUniqueAmongSubcategoryAgnostic(events, event) {
      return !events.some((uniqueEvent) => {
        return uniqueEvent.category === event.category
          && uniqueEvent.channel === event.channel;
      });
    }

    const groupDictionary = {};
    const nodes = state.events
        .reduce((events, event) => {
          groupDictionary[event.category] = Object.keys(groupDictionary).length;
          if (isEventUniqueAmong(events, event)) {
            event.group = groupDictionary[event.category];
            events.push(event);
          }

          return events;
        }, []);

    const subcategoryAgnosticNodes = nodes
        .reduce((events, event) => {
          if (isEventUniqueAmongSubcategoryAgnostic(events, event)) {
            events.push(event);
          }

          return events;
        }, []);

    const sendNodes = nodes.filter((node) => node.interceptionStrategy === 'send');
    const onNodes = nodes.filter((node) => node.interceptionStrategy === 'on');

    const links = [];
    sendNodes.forEach((source) => {
      onNodes.forEach((target) => {
        if (source.channel === target.channel && source.subcategory !== target.subcategory) {
          links.push({
            source,
            target,
            value: 1,
          });
        }
      });
    });

    return {
      nodes: subcategoryAgnosticNodes,
      links,
    };
  },
};

const mutations = {
  add(state, event) {
    /* const {source, channel, timestamp} = event;
    if (!state.preGraph[source]) {
      Vue.set(state.preGraph, source, {});
    }
    if (!state.preGraph[source][channel]) {
      Vue.set(state.preGraph[source], channel, []);
    }
    state.preGraph[source][channel].push(timestamp);*/

    state.events.push(event);
  },
  select(state, event) {
    state.selectedEvent = event;
  },
  recalculateOptions(state) {
    state.options.category = unique(state.events.map((event) => event.category));
    state.options.subcategory = unique(state.events.map((event) => event.subcategory));
    state.options.channel = unique(state.events.map((event) => event.channel));
    const timestamps = state.events.map((event) => event.timestamp);
    state.options.timestamp.min = Math.min(...timestamps);
    state.options.timestamp.max = Math.max(...timestamps);
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
  select({commit}, event) {
    commit('select', event);
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
