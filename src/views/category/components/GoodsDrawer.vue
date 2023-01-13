<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" @submit="handleConnect" confirmText="关联">
    <el-table :data="tableData" border stripe style="width:100%;">
      <el-table-column prop="goods_id" label="ID" width="60" />
      <el-table-column label="商品封面" width="180">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(row)">
            <template #reference>
              <el-button text type="primary" size="small" :loading="row.loading" @click.stop>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>

  <ChooseGoods ref="ChooseGoodsRef" />
</template>

<script setup>
import { ref } from "vue"
import FormDrawer from '~/components/FormDrawer.vue';
import ChooseGoods from "~/components/ChooseGoods.vue";
import {
  toast
} from "~/composables/util"

import {
  deleteCategoryGoods,
  getCategoryGoods,
  connectCategoryGoods
} from "~/api/category.js"

const category_id = ref(0); // category的id
const formDrawerRef = ref(null)
const tableData = ref([]);


// 打开组件的时候 传递item数据
const open = (item) => {
  category_id.value = item.id
  item.goodsDrawerLoading = true // 加载按钮动画
  // 请求数据
  getData()
    .then(() => {
      formDrawerRef.value.open()
    })
    .finally(() => {
      item.goodsDrawerLoading = false // 取消按钮加载动画
    })
}

// 抽离获取数据的函数
function getData() {
  // 返回promise
  return getCategoryGoods(category_id.value)
    .then(
      (res) => {
        // console.log('getData')
        tableData.value = res.map(o => {
          o.loading = false // 添加动效
          return o
        })
      }
    );
}

// 删除
const handleDelete = (row) => {
  // 添加按钮动效
  row.loading = true
  deleteCategoryGoods(row.id)
    .then(res => {
      // 已经删除了 不用将loading置false
      toast("删除成功")
      getData()
    })
    .finally(() => {
      console.log('finally')
      console.log(row)
    })
}

// 打开关联对话框
const ChooseGoodsRef = ref(null)
const handleConnect = () => {
  // 传递一个回调函数 当ChooseGoods提交时submit 执行传递的回调函数
  ChooseGoodsRef.value.open((goods_ids) => {
    formDrawerRef.value.showLoading()
    connectCategoryGoods({
      category_id: category_id.value,
      goods_ids
    }).then(res => {
      getData()
      toast("关联成功")
    })
      .finally(() => {
        formDrawerRef.value.hideLoading()
      })
  })
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>

</style>