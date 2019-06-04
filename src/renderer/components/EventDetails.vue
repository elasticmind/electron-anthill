<template>
  <panel>
    <span slot="title">
      Details
    </span>
    <ul>
      <li v-for="(value, key) in event" :key="key">
        <span>{{ key }}: {{ value }}</span>
      </li>
    </ul>
  </panel>
</template>

<script>
import Panel from '@/components/Panel';

export default {
  components: {
    Panel,
  },
  props: {
    event: {
      type: Object,
    },
  },
};
</script>

<style>

</style>
