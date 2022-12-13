<template>
  <el-drawer title="设置轮播图" v-model="dialogVisble" size="50%" destroy-on-close>
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图" class="yyy">
        <choose-image :limit="9" v-model="form.banners"></choose-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>

  </el-drawer>

</template>

<script setup >
import { ref, reactive } from 'vue';
import ChooseImage from "~/components/ChooseImage.vue";
import { toast } from "~/composables/util";
import {
  readGoods,
  setGoodsBanner
} from "~/api/goods"

const emits = defineEmits(['reloadData'])

const dialogVisble = ref(false)

// 轮播图
const form = reactive({
  banners: []
})


const goodsId = ref(0)
const open = (row) => {
  // 传递过来的row还是响应式的
  // console.log(isProxy(row)) // true
  goodsId.value = row.id
  row.bannersLoading = true // 设置轮播图按钮加载状态
  readGoods(goodsId.value)
    .then(res => {
      form.banners = res.goodsBanner.map(o => o.url)
      dialogVisble.value = true
    })
    .finally(() => {
      row.bannersLoading = false
    })
}

// 按钮增加加载状态
const loading = ref(false)
const onSubmit = () => {
  loading.value = true
  setGoodsBanner(goodsId.value, form)
    .then(res => {
      toast("设置轮播图成功")
      dialogVisble.value = false
      emits("reloadData")
    })
    .finally(() => {
      loading.value = false
    })
}

defineExpose({
  open
})

</script>

<style scoped>

</style>