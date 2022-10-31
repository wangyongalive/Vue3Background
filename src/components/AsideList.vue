<!-- 列表组件 -->
<template>
  <div class="aside-list" :class="{ 'active': active }">
    <!-- overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap; -->
    <!-- 超出显示省略号   标题使用slot-->
    <span class="truncate">
      <slot />
    </span>
    <!-- margin-left: auto 之后都推向最右边 -->
    <el-button text type="primary" class="ml-auto px-1" @click="$emit('edit')">
      <el-icon :size="12">
        <edit />
      </el-icon>
    </el-button>
    <el-button text type="primary" class="px-1" @click="$emit('delete')">
      <el-icon :size="12">
        <close />
      </el-icon>
    </el-button>
  </div>
</template>
<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(["edit", "delete"])
</script>
<style scoped lang="scss">
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}

.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>