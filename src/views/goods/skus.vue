<template>
  <form-drawer ref="formDrawerRef" title="设置商品规格" @submit="submit" destroy-on-close size="70%">
    <el-form>
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">
            单规格
          </el-radio>
          <el-radio :label="1">
            多规格
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width:40%" type="number">
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width:40%" type="number"> <template #append>
              元
            </template></el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width:40%" type="number"> <template #append>
              元
            </template></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width:40%" type="number">
            <template #append>
              公斤
            </template></el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width:40%" type="number">
            <template #append>
              立方米
            </template>
          </el-input>
        </el-form-item>
        <tets></tets>
      </template>
      <template v-else>
        多规格
      </template>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import tets from "./tets.vue"

import {
  readGoods,
  updateGoodsSkus
} from "~/api/goods"
import { toast } from "~/composables/util";


const emit = defineEmits(["reloadData"])

const formDrawerRef = ref(null)

const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0
  }
})

const goods = ref(0)
const open = (row) => {
  goods.value = row.id;
  row.skusLoading = true // 设置商品规格按钮加载状态
  readGoods(goods.value)
    .then(res => {
      form.sku_type = res.sku_type;
      form.sku_value = res.sku_value || {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0
      }
      formDrawerRef.value.open() // 打开详情
    })
    .finally(() => {
      row.skusLoading = false
    })
}


const submit = () => {
  // 加载按钮
  formDrawerRef.value.showLoading()
  updateGoodsSkus(goods.value, form)
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