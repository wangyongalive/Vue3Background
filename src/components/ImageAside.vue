<template>
  <el-aside width="220px" class="image-aside">
    <div class="top">
      <div v-for="i in 100" :key="i">{{ i }}</div>
    </div>
    <div class="bottom">分页区域</div>
  </el-aside>
</template>

<script>

</script>

<style lang="scss" scoped>
.image-aside {
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