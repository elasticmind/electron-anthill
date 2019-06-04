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
  border: 1px solid red;
  box-shadow: 0 0 2px blue;
}

.title {
  text-align: center;
}
</style>
