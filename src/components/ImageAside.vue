<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <!-- 动态添加active类class -->
      <aside-list v-for="(item, index) in list" :key="index" :active="activeId == item.id">
        {{ item.name }}
      </aside-list>

    </div>
    <div class="bottom">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, next" :total="total" :page-size="limit" @current-change="getData"
        :current-page="currentPage" />
    </div>
  </el-aside>

  <form-drawer title="新增" ref="formDrawerRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>

  </form-drawer>
</template>

<script setup>
import { reactive, ref } from "vue";
import AsideList from './AsideList.vue'
import FormDrawer from './FormDrawer.vue'
import { toast } from '@/composables/util'



import {
  getImageClassList,
  createImageClass
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


// 打开抽屉
const formDrawerRef = ref(null)
const handleCreate = () => {
  formDrawerRef.value.open()
}
// 提交表单
const handleSubmit = () => {
  console.log(formRef.value)
  formRef.value.validate((validate) => {
    if (!validate) return;
    formDrawerRef.value.showLoading()
    createImageClass(form).then(res => {
      toast('新增成功')
      getData(1)
      formDrawerRef.value.close()
    }).catch(() => { })
      .finally(() => {
        formDrawerRef.value.hideLoading()
      })
  })
}

const form = reactive({
  name: "111",
  order: 50
})
const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      trigger: "blur",
    },
  ]
}

const formRef = ref(null)




// 向外暴露方法
defineExpose({
  handleCreate
})

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