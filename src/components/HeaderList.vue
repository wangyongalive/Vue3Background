<template>
  <!-- 新增 | 刷新  -->
  <div class="flex justify-center justify-between mb-4">
    <el-button type="primary" size="small" @click.stop="$emit('create')">新增</el-button>
    <el-tooltip content="刷新数据" placement="top" effect="dark">
      <el-button text size="default" @click.stop="$emit('reFresh')">
        <el-icon :size="20">
          <refresh></refresh>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>

defineEmits([
  "create", "reFresh"
])
</script>

<style scoped>

</style>
