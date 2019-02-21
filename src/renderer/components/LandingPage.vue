<template>
  <div class="wrapper">
    <div class="source-pane" v-for="(events, source) in history" :key="source">
      <h2>
        {{ source }}
      </h2>
      <ul>
        <li v-for="(eventData, index) in events" :key="index">
          <h5>
            {{ eventData.channel }}, ({{ eventData.timestamp }})
          </h5>
          <pre>
            {{ eventData.stack }}
          </pre>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'landing-page',
  data() {
    return {
      sources: [],
    };
  },
  computed: {
    history() {
      return this.$store.state.events.history;
    },
  },
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  .wrapper {
    background-color:rgb(229, 229, 229);
    padding: 40px;
    display: flex;
    flex-direction: row;
  }

  .source-pane {
    flex-grow: 1;
    flex-basis: 0;
    margin: 10px;
    overflow: auto;
  }

  .source-pane pre {
    width: 100%;
    overflow-x: scroll;
  }

  ul {
    list-style-type: none;
  }
</style>
