<template>
  <div>
    {{ list }}
    {{ com.length }}
    <el-button @click.stop="handleClik">按钮状态</el-button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const handleClik = () => {
  list.value[0].value = 10
}

const list = ref([{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }])

const com = computed(() => {
  return list.value.filter(v => v.value > 2)
})
</script>

<style lang="scss" scoped>

</style>