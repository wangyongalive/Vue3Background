<template>
  <!-- 布局容器 -->
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">
      <el-button size="small" @click.stop="handleOpenCreate" type="primary">新增图片分类</el-button>
    </el-header>
    <el-container>
      <image-aside ref="ImageAsideRef"></image-aside>
      <image-main></image-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
// .vue 要加后缀
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const ImageAsideRef = ref(null)

const handleOpenCreate = () => {
  ImageAsideRef.value.handleCreate()
}

</script>

<style lang="scss">
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>
