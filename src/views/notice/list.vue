<template>

  <el-card shadow="always">
    <!-- 新增和刷新 -->
    <header-list @create="handleCreate" @reFresh="handleReresh"></header-list>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="default" text @click.stop="hanleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="hanleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary">
                删除
                {{ scope.rows }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-center mt-5">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />

      <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="公告标题"></el-input>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
          </el-form-item>
        </el-form>
      </form-drawer>
    </div>
  </el-card>

</template>

<script setup>
import { getNotice, createNotice, updateNotice, deleteNotice } from "@/api/notice";
import FormDrawer from "../../components/FormDrawer.vue";
import HeaderList from "@/components/HeaderList.vue";
import { useInitTable, useInitForm } from "@/composables/useCommon";

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
} = useInitTable({
  getList: getNotice,
  delete: deleteNotice
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
        title: "标题",
        content: '内容'
      },
      rules: {
        title: [{
          required: true,
          message: "公告名称不能为空",
          trigger: "blur",
        }],
        content: [{
          required: true,
          message: "公告内容不能为空",
          trigger: "blur",
        }]
      },
      getData,
      update: updateNotice,
      create: createNotice
    }
  )

</script>