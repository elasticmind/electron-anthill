<template>
  <div>
    <h1>
      Details
    </h1>
    <ul>
      <li v-for="(value, key) in event" :key="key">
        <span>{{ key }}: {{ value }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
    },
  },
};
</script>

<style>

</style>
