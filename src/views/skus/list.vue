<template>
  <el-card shadow="always">
    <!-- 新增 |刷新 | 删除 -->
    <header-list layout="create,delete,reFresh" @create="handleCreate" @reFresh="handleReresh"
      @delete="handleMultiDelete"></header-list>

    <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
      style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" width="380" />
      <el-table-column prop="order" label="排序" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
            :disabled="row.super == 1" @change="handleStatusChange($event, row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="hanleEdit(scope.row)">修改</el-button>
          {{ scope.row.id }}
          <el-popconfirm title="是否要删除该规格？" confirmButtonText="确认" cancelButtonText="取消"
            @confirm="hanleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-center mt-5">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />
    </div>

    <!-- 新增和修改 -->
    <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <!-- <el-input v-model="form.default" placeholder="规格值"></el-input> -->
          <!-- {{ form.default }} -->
          <tag-input v-model="form.default"></tag-input>
        </el-form-item>
      </el-form>
    </form-drawer>

  </el-card>

</template>

<script setup>
import { ref } from 'vue';
import {
  getSkusList,
  createSkus,
  updateSkus,
  deleteSkus,
  updateSkusStatus,
} from "~/api/skus"
import FormDrawer from "../../components/FormDrawer.vue";
import TagInput from "../../components/TagInput.vue";
import HeaderList from "@/components/HeaderList.vue";
import { useInitTable, useInitForm } from "@/composables/useCommon";
import { toast } from "@/composables/util";
// 抽离 列表分页和搜索
const {
  searchForm,
  restSearchForm,
  loading,
  tableData,
  currentPage,
  total,
  limit,
  getData,
  hanleDelete,
  handleStatusChange,
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkus,
  updateStatus: updateSkusStatus,
  onGetListSuccess: (res) => {
    total.value = res.totalCount;
    tableData.value = res.list.map((o) => {
      o.statusLoading = false; // switch 默认没有动画
      return o;
    });
  },
})

// 抽离新增和修改(编辑)

const {
  drawTitle,
  formDrawerRef,
  formRef,
  form,
  rules,
  resetForm,
  handleCreate,
  hanleEdit,
  handleSubmit,
  handleReresh } = useInitForm(
    {
      form: {
        name: "",
        status: 1,
        default: "",
        order: 50
      },
      rules: {
        name: [{
          required: true,
          message: '规格名称不能为空',
          trigger: 'blur'
        }],
        default: [{
          required: true,
          message: '规格值不能为空',
          trigger: 'blur'
        }],
      },
      getData,
      update: updateSkus,
      create: createSkus
    }
  )


</script>