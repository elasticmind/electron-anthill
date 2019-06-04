<template>
  <panel class="panel">
    <span slot="title">
      Events
    </span>
    <select class="event-selection" v-model="selectedEvents" multiple>
      <option v-for="(event, index) in events" :key="index" :value="event">
        {{ event.category }} {{ event.subcategory }} {{ event.channel }}
      </option>
    </select>
  </panel>
</template>

<script>
import Panel from '@/components/Panel';
import EventListItem from '@/components/EventListItem';

export default {
  components: {
    Panel,
    EventListItem,
  },
  props: {
    events: {
      type: Array,
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

<style lang="scss" scoped>
.event-selection {
  margin: auto;
  width: 100%;
  display: block;
  flex-grow: 1;
}
</style>
