<template>
  <form-drawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
    <el-form>
      <el-form-item>
        <Editor v-model="form.content"></Editor>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import Editor from "~/components/Editor.vue"

import {
  readGoods,
  updateGoods
} from "~/api/goods"
import { toast } from "~/composables/util";


const emit = defineEmits(["reloadData"])

const formDrawerRef = ref(null)

const form = reactive({
  content: ""
})

const goods = ref(0)
const open = (row) => {
  goods.value = row.id;
  row.contentLoading = true // 设置商品详情按钮加载状态
  readGoods(goods.value)
    .then(res => {
      form.content = res.content
      formDrawerRef.value.open() // 打开详情
    })
    .finally(() => {
      row.contentLoading = false
    })
}


const submit = () => {
  // 加载按钮
  formDrawerRef.value.showLoading()
  updateGoods(goods.value, form)
    .then(res => {
      toast("设置商品详情成功")
      formDrawerRef.value.close() // 打开详情
      emit("reloadData")
    })
    .finally(() => {
      // 取消加载按钮
      formDrawerRef.value.hideLoading()
    })
}


defineExpose({
  open
})


</script>

<style scoped>

</style>