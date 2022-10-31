<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <!-- 动态添加active类class -->
      <aside-list v-for="(item, index) in list" :key="index" :active="activeId == item.id">
        {{ item.name }}
      </aside-list>

    </div>
    <div class="bottom">
      <el-pagination background layout="prev, next" :total="total" :page-size="limit" @current-change="getData"
        :current-page="currentPage" />
    </div>
  </el-aside>
</template>

<script setup>
import { ref } from "vue";
import AsideList from './AsideList.vue'
import {
  getImageClassList
} from "@/api/image_class.js"

// 加载动画
const loading = ref(false)
const list = ref([])
const activeId = ref(0)


// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
function getData(limit) {
  currentPage.value = limit;
  loading.value = true;  // 开始加载动画
  getImageClassList(limit).then(res => {
    total.value = res.totalCount
    list.value = res.list;
    let item = list.value[0]
    if (item) { // 如果item存在
      activeId.value = item.id;
    }
  }).finally(() => {
    loading.value = false // 无论失败还是成功 都关闭动画
  })
}

getData(currentPage.value)



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