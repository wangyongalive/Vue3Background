<template>
  <!-- 布局容器 -->
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">Header</el-header>
    <el-container>
      <image-aside></image-aside>
      <image-main></image-main>
    </el-container>
  </el-container>
</template>

<script setup>
// .vue 要加后缀
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40


</script>

<style lang="scss">
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
