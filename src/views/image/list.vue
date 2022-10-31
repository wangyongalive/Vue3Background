<template>
  <!-- 布局容器 -->
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">Header</el-header>
    <el-container>
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div v-for="i in 100" :key="i">{{ i }}</div>
        </div>
        <div class="bottom">分页区域</div>
      </el-aside>
      <el-main class="image-main">
        <!-- 页面编写技巧：写多个标签模拟大量数据的情况 -->
        <div class="top">
          <div v-for="i in 100" :key="i">{{ i }}</div>
        </div>
        <div class="bottom">分页区域</div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40


</script>

<style lang="scss">
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}

.image-aside,.image-main {
  border-right: 1px solid #eee;
  position: relative;

  .top {
    position: absolute;
    /*aside的overflow:auto 会产生进度条*/
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /*top标签超出 在top标签内部产生滚动条 而不是aside*/
  }

  .bottom {
    // bottom: 0;
    // height: 50px;
    // left: 0;
    /* left:0;  right:0; 可以使内容撑开*/
    // right: 0;
    @apply flex items-center justify-center absolute bottom-0 left-0 right-0 h-50px;
  }
}
</style>
