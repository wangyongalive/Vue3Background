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
    <el-button text type="primary" class="ml-auto px-1" @click.stop="$emit('edit')">
      <el-icon :size="12">
        <edit />
      </el-icon>
    </el-button>

    <!-- 确认时emit('delete') -->
    <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消" @confirm="$emit('delete')">
      <template #reference>
        <el-button text type="primary" class="px-1">
          <el-icon :size="12">
            <close />
          </el-icon>
        </el-button>
      </template>
    </el-popconfirm>

  </div>
</template>
<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

// emit中的事件不会出现在调试器中的事件监听中
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