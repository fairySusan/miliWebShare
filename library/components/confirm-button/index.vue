<template>
  <a-popconfirm :type="type" :content="content" @ok="$emit('ok')">
    <slot>
      <a-button type="outline">删除</a-button>
    </slot>
  </a-popconfirm>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  content?: string;
  type?: 'warning' | 'success' |  'info' | 'error'
}>(), {
  content: '确认是否删除?',
  type: 'warning'
})

defineEmits<{
  (event: 'ok'):void
}>()
</script>