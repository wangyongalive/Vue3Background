<template>
  <el-card shadow="never" class="border-0">
    <header-list></header-list>
    <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }"
      :default-expanded-keys="defaultExpandedKeys" node-key="id" v-loading="loading" />
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

<style scoped>

</style>
