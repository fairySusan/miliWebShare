<template>
  <a-button @click="$emit('click')">
    <template #icon><icon-refresh /></template>
  </a-button>
</template>

<script setup lang="ts">
  defineEmits<{
    (event: 'click', e: Event):void
  }>()
</script>