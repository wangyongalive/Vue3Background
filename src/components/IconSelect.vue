<template>
  <div class="flex items-center">
    <el-icon v-if="modelValue" class="mr-2">
      <component :size="20" :is="modelValue"></component>
    </el-icon>
    <el-select :model-value="modelValue" filterable placeholder="请选择图标" @change="handleChange">
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <template #default>
          <div class="flex items-center justify-between">
            <el-icon>
              <component :is="item"></component>
            </el-icon>
            <span class="text-gray-500">
              {{ item }}
            </span>
          </div>
        </template>
      </el-option>
    </el-select>

  </div>
</template>

<script setup>
import { ref } from 'vue'
// 所有图标集合
import * as iconList from "@element-plus/icons-vue";

const icons = ref(Object.keys(iconList))
defineProps({
  modelValue: String
})
const emits = defineEmits(["update:modelValue"])
const handleChange = (icon) => {
  emits('update:modelValue', icon)
}

</script>

<style lang="scss" scoped>

</style>