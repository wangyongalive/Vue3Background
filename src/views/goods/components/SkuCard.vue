<template>
  <el-form-item label="规格选项" style="width:100%">
    <el-card shadow="never" class="y-card" v-for="card in sku_card_list" :key="card.id" v-loading="card.loading">
      <template #header>
        <div class="flex items-center">
          <el-input v-model="card.text" placeholder="规格名称" style="width:200px;" @change="handleUpdate(card)">
            <template #append>
              <el-icon>
                <more />
              </el-icon>
            </template>
          </el-input>
          <el-button class="ml-auto" size="small"><el-icon>
              <Top />
            </el-icon></el-button>
          <el-button size="small"><el-icon>
              <Bottom />
            </el-icon></el-button>
          <el-button size="small"><el-icon>
              <Delete />
            </el-icon></el-button>
        </div>
      </template>
      <sku-card-item :skuCardId="card.id"></sku-card-item>
    </el-card>
    <el-button type="success" size="small" :loading="btnLoading" @click.stop="addSkuCardEvent">添加规格</el-button>
  </el-form-item>
</template>

<script setup>
import SkuCardItem from './SkuCardItem.vue';
import {
  btnLoading,
  sku_card_list,
  addSkuCardEvent,
  handleUpdate
} from "~/composables/useSku.js"

</script>

<style lang="scss" scoped>
.y-card {
  width: 100%;
  margin-bottom: 10px;

  :deep(.el-card__header) {
    @apply bg-gray-50;
  }
}
</style>