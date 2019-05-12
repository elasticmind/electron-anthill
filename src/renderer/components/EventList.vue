<template>
  <div>
    <h1>
      Events
    </h1>
    <ul>
      <li v-for="event in events">
        <event-list-item :class="{'selected': isSelectedEvent(event)}" :event="event" @click.native="click(event)"/>
      </li>
    </ul>
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
    click(clickedEvent) {
      this.$store.dispatch('select', clickedEvent);
    },
    isSelectedEvent(event) {
      return event === this.selectedEvent;
    },
  },
  computed: {
    selectedEvent() {
      return this.$store.state.events.selectedEvent;
    },
  },
};
</script>

<style scoped>
.selected {
  background-color: red;
}
</style>
