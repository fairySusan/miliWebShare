<template>
  <a-cascader 
    :options="options" 
    :style="{width:'240px'}" 
    allow-search
    placeholder="请选择团队/产品" 
    @change="onChange"
    v-model="_modelValue"
  />
</template>

<script setup lang="ts">
import { getTeamProduct } from "../../api/user"
import { TeamItemI } from "../../types/global";
import { onMounted, ref, watch } from "vue";
import { SelectedTeamProductI } from '../../types/global'

const options = ref<any>([])
const teamList = ref<TeamItemI[]>([])
const _modelValue = ref('')

const props = withDefaults(defineProps<{
  modelValue?: string
}>(), {
  modelValue: ''
})

const $emit = defineEmits<{
  (event: 'change', data:SelectedTeamProductI):void;
  (event: 'update:modelValue', value: string):void
}>()

watch(() => props.modelValue, (newVal) => {
  _modelValue.value = newVal
}, {immediate: true})

onMounted(() => {
  _getTeamProduct()
})

const _getTeamProduct = () => {
  getTeamProduct().then(res => {
    teamList.value = res.data.teamList
    res.data.teamList.forEach(item => {
      const r: any = {
        label: item.teamName,
        value: item.id,
        children: []
      }
      item.productList.forEach(p => {
        r.children.push({
          label: p.name,
          value: p.id
        })
      })
      options.value.push(r)
    })
    if (_modelValue.value) {
      // 如果有初始值的话
      res.data.teamList.forEach(item => {
        item.productList.forEach(p => {
          if (p.id === _modelValue.value) {
            $emit('change', {
              team: {
                teamName: item.teamName,
                id: item.id
              },
              product: p
            })
          }
        })
      })
    } else {
      // 如果没有初始值，就默认取第一条数据
      const target = res.data.teamList[0]
      _modelValue.value = target.productList[0].id
      $emit('change', {
        team: {
          teamName: target.teamName,
          id: target.id
        },
        product: target.productList[0]
      })
    }
  })
}

const onChange = (value: any) => {
  $emit('update:modelValue', value)
  teamList.value.forEach(item => {
    item.productList.forEach(p => {
      if (p.id === value) {
        $emit('change', {
          team: {
            teamName: item.teamName,
            id: item.id
          },
          product: p
        })
        return 
      }
    })
  })
}
</script>