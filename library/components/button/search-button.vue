<template>
  <a-button type="outline" @click="$emit('click')">搜索</a-button>
</template>

<script setup lang="ts">
  defineEmits<{
    (event: 'click', e: Event):void
  }>()
</script>