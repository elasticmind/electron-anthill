<template>
  <div class="panel">
    <h1 class="title">
      <slot name="title" />
    </h1>
    <slot class="content" />
  </div>
</template>

<style>
.panel {
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.title {
  text-align: center;
}
</style>
