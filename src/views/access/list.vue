<template>
  <el-card shadow="never" class="border-0">
    <header-list @reFresh="getData"></header-list>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }"
      :default-expanded-keys="defaultExpandedKeys" node-key="id" v-loading="loading">
      <template #default="{ data }">
        <!-- h-[40px]  写在外面的div -->
        <div class="flex flex-1 items-center">
          <!-- <div> -->
          <el-tag :type="data.menu == 1 ? '' : 'info'">
            {{ data.menu == 1 ? '菜单' : '权限' }}
          </el-tag>
          <el-icon v-if="data.icon" :size="16" class="mx-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span> {{ data.name }}</span>
          <!-- </div> -->
          <div class="ml-auto">
            <el-switch :model-value="data.status" :active-value="1" :inactive-value="0">
            </el-switch>
            <el-button type="primary" text>修改</el-button>
            <el-button type="primary" text>增加</el-button>
            <el-button type="primary" text>删除</el-button>
          </div>

        </div>
      </template>
    </el-tree>
  </el-card>

</template>

<script setup>
import { ref } from 'vue'
import HeaderList from "@/components/HeaderList.vue";
import { getRuleList } from '@/api/rule';
import { useInitTable } from '@/composables/useCommon.js';

const defaultExpandedKeys = ref([])
const {
  tableData,
  getData,
  loading
} = useInitTable(
  {
    getList: getRuleList,
    onGetListSuccess: (res) => {
      console.log(res)
      tableData.value = res.list
      defaultExpandedKeys.value = res.list.map(o => o.id)
      console.log(defaultExpandedKeys.value)
    }
  }
)



</script>

<style lang="scss" scoped>
:deep(.el-tree-node__label) {
  flex: 1;
}

:deep(.el-tree-node__content) {
  height: 40px;
}
</style>
