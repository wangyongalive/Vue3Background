<!-- 图片列表main -->
<template>
  <el-main class="image-main" v-loading="loading">
    <!-- 页面编写技巧：写多个标签模拟大量数据的情况 -->
    <div class="top">
      <div v-for="i in list" :key="i">{{ i }}</div>
    </div>
    <div class="bottom">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev,pager, next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />
    </div>
  </el-main>
</template>

<script setup>
import { ref } from "vue";
import {
  getImageList
} from "@/api/image.js"


// 加载动画
const loading = ref(false)
const list = ref([])

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const image_class_id = ref(0)


// 获取数据
function getData(limit, id = image_class_id.value) {
  // currentPage.value = limit;
  loading.value = true;  // 开始加载动画
  getImageList(id, limit).then(res => {
    total.value = res.totalCount
    list.value = res.list;
  }).finally(() => {
    loading.value = false // 无论失败还是成功 都关闭动画
  })
}


// 根据分类ID重新加载图片列表
const loadData = (id) => {
  currentPage.value = 1
  image_class_id.value = id
  getData(1, id)
}


defineExpose({
  loadData
}
)
</script>

<style lang="scss" scoped>
.image-main {
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