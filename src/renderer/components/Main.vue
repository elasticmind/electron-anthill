<template>
  <div class="wrapper">
    <button @click="refreshGraph">Refresh Graph</button>
    <graph :key="graphRenderCount"/>
    <div class="w-half flex flex-h">
      <div class="w-half of-scroll">
        <event-list :events="events"/>
      </div>
      <div class="w-half flex flex-v">
        <div class="h-half">
            <events-options />
        </div>
        <div class="h-half">
          <event-details :event="selectedEvent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventDetails from '@/components/EventDetails';
import EventList from '@/components/EventList';
import EventsOptions from '@/components/EventsOptions';
import Graph from '@/components/Graph';

export default {
  components: {
    EventDetails,
    EventList,
    EventsOptions,
    Graph,
  },
  data() {
    return {
      sources: [],
      graphRenderCount: 0,
    };
  },
  computed: {
    events() {
      return this.$store.getters.filteredEvents;
    },
    selectedEvent() {
      return this.$store.state.events.selectedEvent;
    },
  },
  methods: {
    refreshGraph() {
      this.graphRenderCount++;
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
}

.wrapper {
  background-color: rgb(229, 229, 229);
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

.of-scroll {
  overflow-y: scroll;
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
