<template>
  <div>
    <el-card shadow="always">
      <!-- 新增 | 刷新  -->
      <div class="flex justify-center justify-between mb-4">
        <el-button type="primary" size="small">新增</el-button>
        <el-tooltip content="刷新数据" placement="top" effect="dark">
          <el-button link size="default">
            <el-icon :size="20">
              <refresh></refresh>
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </el-card>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="default">修改</el-button>
          <el-popconfirm title="是否删除该分类?" confirm-button-text="确认" cancel-button-text="取消"
            @confirm="hanleDelete(scope.row.id)">
            <template #reference>
              <el-button link type="primary">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script setup>
import { ref } from 'vue'
const tableData = ref([])
const getData = () => {
  tableData.value = [
    {
      "id": 13,
      "title": "nip",
      "content": "nip\n",
      "order": 0,
      "create_time": "2022-06-06 14:40:11",
      "update_time": "2022-06-06 14:40:11"
    },
    {
      "id": 14,
      "title": "nip",
      "content": "nip\n",
      "order": 0,
      "create_time": "2022-06-06 14:40:11",
      "update_time": "2022-06-06 14:40:11"
    },
    {
      "id": 15,
      "title": "nip",
      "content": "nip\n",
      "order": 0,
      "create_time": "2022-06-06 14:40:11",
      "update_time": "2022-06-06 14:40:11"
    }
  ]
}

getData()

const hanleDelete = () => {
  console.log('hanleDelete')
}


</script>