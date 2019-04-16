import Vue from 'vue';

const state = {
  absoluteHistory: [],
  preGraph: {},
};

const getters = {
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
    const nodes = state.absoluteHistory.
        reduce((events, event) => {
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

    state.absoluteHistory.push(event);
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
  getters,
  mutations,
  actions,
};
