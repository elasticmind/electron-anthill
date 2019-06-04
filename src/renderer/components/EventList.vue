<template>
  <div>
    <button @click="refreshGraph">Refresh Graph</button>
    <h1>
      Events
    </h1>
    <select v-model="selectedEvents" multiple>
      <option v-for="(event, index) in events" :key="index">
        {{ event.category }} {{ event.subcategory }} {{ event.channel }}
      </option>
    </select>
  </div>
</template>

<script>
import EventListItem from '@/components/EventListItem';

export default {
  components: {
    EventListItem,
  },
  props: {
    events: {
      type: Array,
    },
  },
  methods: {
    refreshGraph() {
      this.$store.commit('incrementGraphRenderCount');
    },
  },
  computed: {
    selectedEvents: {
      set(events) {
        this.$store.commit('setSelectedEvents', events);
      },
      get() {
        return this.$store.state.events.selectedEvents;
      },
    },
  },
};
</script>
