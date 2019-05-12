<template>
  <div>
    <label for="filterToggle">
      <h1>
        <input type="checkbox" id="filterToggle" v-model="filterToggle"/>
        Filtering
      </h1>
    </label>
    <label for="channel-select">
      Channel:
      <select id="channel-select" v-model="selectedChannel" multiple>
        <option v-for="channelItem in channel" :key="channelItem">
          {{ channelItem }}
        </option>
      </select>
    </label>
    <h3>Timestamp</h3>
    <label for="timestamp-min">
      Min: {{ timestampMin }}<br>
      <input type="range" id="timestamp-min" v-model="timestampMin" :min="timestampMinLowerBound" :max="timestampMax"/>
    </label>
    <br>
    <label for="timestamp-max">
      Max: {{ timestampMax }}<br>
      <input type="range" id="timestamp-max" v-model="timestampMax" :min="timestampMin" :max="timestampMaxUpperBound"/>
    </label>
  </div>
</template>

<script>
export default {
  computed: {
    filterToggle: {
      set(shouldFilter) {
        this.$store.commit('setFilterToggle', shouldFilter);
      },
      get() {
        return this.$store.state.events.filterToggle;
      },
    },
    selectedChannel: {
      set(channels) {
        this.$store.commit('setSelectedChannel', channels);
      },
      get() {
        return this.$store.state.events.selectedChannel;
      },
    },
    timestampMin: {
      set(timestamp) {
        this.$store.commit('setSelectedMin', timestamp);
      },
      get() {
        return this.$store.state.events.selectedMin;
      },
    },
    timestampMax: {
      set(timestamp) {
        this.$store.commit('setSelectedMax', timestamp);
      },
      get() {
        return this.$store.state.events.selectedMax;
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
};
</script>

<style>
</style>
