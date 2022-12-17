<template>
  <el-form-item label="规格选项" style="width:100%" v-loading="bodyLoading">
    <el-card shadow="never" class="y-card" v-for="(card, index) in sku_card_list" :key="card.id"
      v-loading="card.loading">
      <template #header>
        <div class="flex items-center">
          <el-input v-model="card.text" placeholder="规格名称" style="width:200px;" @change="handleUpdate(card)">
            <template #append>
              <el-icon>
                <more />
              </el-icon>
            </template>
          </el-input>
          <el-button class="ml-auto" size="small" @click.stop="sortCard('up', index)" :disabled="index == 0"><el-icon>
              <Top />
            </el-icon></el-button>
          <el-button size="small" @click.stop="sortCard('down', index)"
            :disabled="index === (sku_card_list.length - 1)"><el-icon>
              <Bottom />
            </el-icon></el-button>

          <el-popconfirm title="是否要删除该选项？" confirmButtonText="确认" cancelButtonText="取消" @confirm="handleDelete(card)">
            <template #reference>
              <!-- popconfirm阻止事件冒泡 -->
              <el-button size="small" @click.stop><el-icon>
                  <Delete />
                </el-icon></el-button>
            </template>
          </el-popconfirm>

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
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading
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