<template>
  <div class="event-list-item-wrapper">
    <span>{{ event.channel }}</span>
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

<style scoped>
.event-list-item-wrapper {
  background-color: #dfdfdf;
  cursor: pointer;
}
</style>
