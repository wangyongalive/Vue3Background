<template>
  <el-card shadow="never" class="border-0">
    <ListHeader @create="handleCreate" @refresh="getData" />
    <el-tree class="y-tree" :data="tableData" :props="{ label: 'name', children: 'child' }" v-loading="loading"
      node-key="id">
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <!-- 添加加载动画 -->
            <el-button text type="primary" size="small" @click.stop="openGoodsDrawer(data)"
              :loading="data.goodsDrawerLoading">推荐商品</el-button>

            <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
              @change="handleStatusChange($event, data)" />
            <el-button text type="primary" size="small" @click.stop="hanleEdit(data)">修改</el-button>

            <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
              @confirm="handleDelete(data.id)">
              <template #reference>
                <el-button text type="primary" size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>

    <FormDrawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 单独封装一个推荐商品组件 -->
    <GoodsDrawer ref="GoodsDrawerRef" />

  </el-card>
</template>
<script setup>
import { ref } from 'vue'
import ListHeader from "~/components/HeaderList.vue"
import FormDrawer from "~/components/FormDrawer.vue"
import GoodsDrawer from "./components/GoodsDrawer.vue";
import {
  getCategoryList,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory
} from "~/api/category.js"

import {
  useInitTable,
  useInitForm
} from "~/composables/useCommon.js"

const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList: getCategoryList,
  onGetListSuccess: (res) => {
    // 添加按键加载的动效
    tableData.value = res.map(o => {
      o.goodsDrawerLoading = false
      return o
    })
  },
  delete: deleteCategory,
  updateStatus: updateCategoryStatus
})


const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawTitle,
  handleSubmit,
  handleCreate,
  hanleEdit
} = useInitForm({
  form: {
    name: "",
  },
  rules: {},
  getData,
  update: updateCategory,
  create: createCategory
})



const GoodsDrawerRef = ref(null);
// 数据通过open函数传递
const openGoodsDrawer = (data) => GoodsDrawerRef.value.open(data);

</script>
<style scoped lang="scss">
.y-tree {
  :deep(.el-tree-node__label) {
    width: 100%;
  }

  :deep(.el-tree-node__content) {
    padding: 20px 0;
  }
}

.custom-tree-node {
  // flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
</style>