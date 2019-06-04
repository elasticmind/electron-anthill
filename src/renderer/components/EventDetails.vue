<template>
  <panel>
    <span slot="title">
      Details
    </span>
    <p>
      <span class="key">Category:&nbsp;</span>
      <span>{{ event.category }}</span>
    </p>
    <p>
      <span class="key">Subcategory:&nbsp;</span>
      <span>{{ event.subcategory }}</span>
    </p>
    <p>
      <span class="key">Channel:&nbsp;</span>
      <span>{{ event.channel }}</span>
    </p>
    <p>
      <span class="key">Timestamp:&nbsp;</span>
      <span>{{ event.timestamp }}</span>
    </p>
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

<style lang="scss" scoped>
.key {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
