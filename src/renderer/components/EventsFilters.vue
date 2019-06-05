<template>
  <panel>
    <span slot="title">
      Filters
    </span>
    <label>
      <input type="checkbox" :value="filterToggles['channel']" @input="updateFilterToggle('channel', $event)"/>
      Channel:
      <select :value="filterValues['channel']" @input="updateFilterValue('channel', $event)" multiple>
        <option v-for="channelItem in channel" :key="channelItem">
          {{ channelItem }}
        </option>
      </select>
    </label>
  </panel>
</template>

<script>
import Panel from '@/components/Panel';

export default {
  components: {
    Panel,
  },
  computed: {
    filterToggles() {
      return this.$store.state.events.filterToggles;
    },
    filterValues() {
      console.log('pisti');
      console.log(this.$store);

      return this.$store.state.events.filterValues;
    },
    channel() {
      return this.$store.state.events.options.channel;
    },
    timestampMinLowerBound() {
      return this.$store.state.events.options.timestamp.min;
    },
    timestampMaxUpperBound() {
      return this.$store.state.events.options.timestamp.max;
    },
  },
  methods: {
    updateFilterToggle(filterToggle, event) {
      this.$store.commit('updateFilterToggle', {filterToggle, value: event.data});
    },
    updateFilterValue(filterValue, event) {
      this.$store.commit('updateFilterValue', {filterValue, value: event.data});
    },
  },
};
</script>

<style>
</style>
