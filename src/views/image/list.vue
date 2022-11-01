<template>
  <!-- 布局容器 -->
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">
      <el-button size="small" @click.stop="handleOpenCreate" type="primary">新增图片分类</el-button>
    </el-header>
    <el-container>
      <!-- 兄弟组件 借助父组件进行通信 -->
      <image-aside ref="ImageAsideRef" @change="handleAsideChange"></image-aside>
      <image-main ref="ImageMainRef"></image-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
// .vue 要加后缀
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
// 动态计算可用容器高度
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40;

const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)
</script>

<style lang="scss">
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
