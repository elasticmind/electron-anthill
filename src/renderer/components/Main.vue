<template>
  <div class="wrapper">
    <graph :key="graphRenderCount"/>
    <div class="w-half flex flex-h bg-dark">
      <div class="w-half flex flex-v brd-l">
        <refresh-graph class="refresh-graph"/>
        <event-list class="event-list" :events="events"/>
      </div>
      <div class="w-half flex flex-v brd-l">
        <events-filters class="h-fill"/>
        <event-details class="h-quarter" :event="firstSelectedEvent" />
      </div>
    </div>
  </div>
</template>

<script>
import EventDetails from '@/components/EventDetails';
import EventList from '@/components/EventList';
import EventsFilters from '@/components/EventsFilters';
import Graph from '@/components/Graph';
import RefreshGraph from '@/components/RefreshGraph';

export default {
  components: {
    EventDetails,
    EventList,
    EventsFilters,
    Graph,
    RefreshGraph,
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
    firstSelectedEvent() {
      return this.$store.state.selectedEvents[0] || {};
    },
    graphRenderCount() {
      return this.$store.state.graphRenderCount;
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

.brd-l {
  border-left: 2px solid #404040;
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

.h-quarter {
  height: 25%;
}

.h-fill {
  flex-grow: 1;
}

.h-half {
  height: 50%;
}

.h-full {
  height: 100%;
}

.bg-dark {
  background-color: rgba(0, 0, 0, 0.4);
}

.refresh-graph {
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
