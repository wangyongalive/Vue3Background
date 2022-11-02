<template>
  <div>
    <el-card shadow="always">
      <!-- 新增 | 刷新  -->
      <div class="flex justify-center justify-between mb-4">
        <el-button type="primary" size="small">新增</el-button>
        <el-tooltip content="刷新数据" placement="top" effect="dark">
          <el-button text size="default" @click.stop="handleReresh">
            <el-icon :size="20">
              <refresh></refresh>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </el-card>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="default">修改</el-button>
          <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="hanleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary">
                删除
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
    </div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import { getNotice } from "@/api/notice";


// 加载动画
const loading = ref(false);
const tableData = ref([]);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 获取数据
function getData(page = currentPage.value) {
  loading.value = true; // 开始加载动画
  getNotice(page)
    .then((res) => {
      total.value = res.totalCount;
      tableData.value = res.list;
    })
    .finally(() => {
      loading.value = false; // 无论失败还是成功 都关闭动画
    });
}

getData(currentPage.value);

const hanleDelete = () => {
  console.log("hanleDelete");
};

const handleReresh = () => {
  getData()
}


</script>