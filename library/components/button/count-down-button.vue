<template>
  <a-button :disabled="isClicked" size="large" :type="type" @click="$emit('click')">
    {{ isClicked ? `${count}s`: '获取验证码'}}
  </a-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
withDefaults(defineProps<{
  type?: "primary" | "dashed" | "text" | "outline" | "secondary" | undefined;
}>(), {
  type: "primary"
})
const $emit = defineEmits<{
  (event: 'click'):void
}>()

const count = ref(60)
const isClicked = ref(false)

const startCountDown = () => {
  isClicked.value = true
  setInterval(() => {
    if (count.value > 0) {
      count.value--
    } else {
      count.value = 60
      isClicked.value = false
    }
  }, 1000)
}

defineExpose({
  startCountDown
})
</script>

<style lang="less" scoped>


</style>