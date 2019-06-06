<template>
  <panel>
    <span slot="title">
      Filters
    </span>
    <label>
      <input type="checkbox" :value="filterToggles['category']" @click="updateFilterToggle('category', !filterToggles['category'])"/>
      Category:
      <select :value="filterValues['category']" @change="updateFilterValue('category', $event)" multiple>
        <option v-for="categoryItem in options.category" :key="categoryItem">
          {{ categoryItem }}
        </option>
      </select>
    </label>
    <label>
      <input type="checkbox" :value="filterToggles['subcategory']" @click="updateFilterToggle('subcategory', !filterToggles['subcategory'])"/>
      Subcategory:
      <select :value="filterValues['subcategory']" @change="updateFilterValue('subcategory', $event)" multiple>
        <option v-for="subcategoryItem in options.subcategory" :key="subcategoryItem">
          {{ subcategoryItem }}
        </option>
      </select>
    </label>
    <label>
      <input type="checkbox" :value="filterToggles['channel']" @click="updateFilterToggle('channel', !filterToggles['channel'])"/>
      Channel:
      <select :value="filterValues['channel']" @change="updateFilterValue('channel', $event)" multiple>
        <option v-for="channelItem in options.channel" :key="channelItem">
          {{ channelItem }}
        </option>
      </select>
    </label>
    <label>
      <input type="checkbox" :value="filterToggles['timestamp']" @click="updateFilterToggle('timestamp', !filterToggles['timestamp'])"/>
      Timestamp:
      <label for="timestamp-min">
        Min: {{ timestampMin }}<br>
        <input type="range" id="timestamp-min" v-model="timestampMin" :min="timestampMinLowerBound" :max="timestampMax"/>
      </label>
      <br>
      <label for="timestamp-max">
        Max: {{ timestampMax }}<br>
        <input type="range" id="timestamp-max" v-model="timestampMax" :min="timestampMin" :max="timestampMaxUpperBound"/>
      </label>
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
      return this.$store.state.events.filterValues;
    },
    options() {
      return this.$store.state.events.options;
    },
    timestampMin: {
      set(timestamp) {
        this.$store.commit('setSelectedMin', timestamp);
      },
      get() {
        return this.$store.state.events.filterValues.timestamp.min;
      },
    },
    timestampMax: {
      set(timestamp) {
        this.$store.commit('setSelectedMax', timestamp);
      },
      get() {
        return this.$store.state.events.filterValues.timestamp.min;
      },
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
    updateFilterToggle(filterToggle, value) {
      this.$store.commit('updateFilterToggle', {filterToggle, value});
    },
    updateFilterValue(filterValue, event) {
      const selectedOptions = Array.prototype.filter.call(event.target.options, (option) => option.selected);
      const selectedLabels = Array.prototype.map.call(selectedOptions, (option) => option.label);
      this.$store.commit('updateFilterValue', {filterValue, value: selectedLabels});
    },
  },
};
</script>

<style>
</style>
