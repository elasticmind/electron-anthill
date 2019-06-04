<template>
  <div class="wrapper">
    <graph :key="graphRenderCount"/>
    <div class="w-half flex flex-h">
      <div class="w-half flex flex-v">
        <refresh-graph class="refresh-graph-button"/>
        <event-list class="event-list" :events="events"/>
      </div>
      <div class="w-half flex flex-v">
        <events-options class="h-half"/>
        <event-details class="h-half" :event="selectedEvent" />
      </div>
    </div>
  </div>
</template>

<script>
import EventDetails from '@/components/EventDetails';
import EventList from '@/components/EventList';
import EventsOptions from '@/components/EventsOptions';
import Graph from '@/components/Graph';
import RefreshGraph from '@/components/RefreshGraph';
import devState from '@/devState';

export default {
  components: {
    EventDetails,
    EventList,
    EventsOptions,
    Graph,
    RefreshGraph,
  },
  mounted() {
    this.$store.replaceState(devState);
  },
  data() {
    return {
      sources: [],
    };
  },
  computed: {
    events() {
      return this.$store.getters.filteredEvents;
    },
    selectedEvent() {
      return this.$store.state.events.selectedEvent;
    },
    graphRenderCount() {
      return this.$store.state.graph.graphRenderCount;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  overflow: hidden;
}

.wrapper {
  background: radial-gradient(rgb(250, 250, 250), rgb(201, 201, 201));
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}

.source-pane {
  flex-grow: 1;
  flex-basis: 0;
  margin: 10px;
  overflow: auto;
}

.flex {
  display: flex;
}

.flex-h {
  flex-direction: row;
}

.flex-v {
  flex-direction: column;
}

.w-half {
  width: 50%;
}

.h-half {
  height: 50%;
}

.h-full {
  height: 100%;
}

.refresh-graph-button {
  margin: 10px auto;
}

.event-list {
  margin: auto 0;
  flex-grow: 1;
}

.graph-wrapper {
  width: 50%;
  height: 100vh;
}

.source-pane pre {
  width: 100%;
  overflow-x: scroll;
}

ul {
  list-style-type: none;
}
</style>
