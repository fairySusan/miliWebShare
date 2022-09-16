<template>
  <a-select v-model="_modelValue" :style="{width:'200px'}" @change="onChange" placeholder="请选择团队">
    <a-option v-for="item in teamData" :label="item.teamName" :value="item.id"></a-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getTeamProduct } from '../../api/user';
import { TeamItemI } from '../../types/global';

const $emit = defineEmits<{
  (event: 'change', data: {name: string; id: string}):void;
  (event: 'update:modelValue', id: string):void
}>()
const props = defineProps<{
  modelValue: string
}>()

const teamData = ref<TeamItemI[]>([])
const _modelValue = ref()

onMounted(() => {
  _getTeamdata()
})

watch(() => props.modelValue, (newVal) => {
  _modelValue.value = newVal
})

const _getTeamdata = () => {
  getTeamProduct().then((res) => {
    teamData.value = res.data.teamList
    if (res.data.teamList.length > 0) {
      $emit('update:modelValue', res.data.teamList[0].id)
      _modelValue.value = res.data.teamList[0].id
    }
  })
}

const onChange = (value: any) => {
  const targe = teamData.value.filter(item => item.id === value)
  $emit('change', {name: targe[0].teamName, id: targe[0].id})
}

</script>