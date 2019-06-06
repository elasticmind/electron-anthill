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
