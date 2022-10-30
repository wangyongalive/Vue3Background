<template>
  <div>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="flex justify-between items-center">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </div>
              </template>
              <span class="text-3xl font-bold text-gray-500">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
              </span>
              <el-divider></el-divider>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="margin-right: 16px" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <template #default>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
            <el-card shadow="hover" class="border-0">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="text-sm">{{ item.title }}</span>
                  <el-tag :type="item.unitColor">
                    {{ item.unit }}</el-tag>
                </div>
              </template>
              <span class="text-3xl font-bold text-gray-500">
                <!-- {{ item.value }} -->
                <CountTo :value="item.value"></CountTo>
              </span>
              <el-divider></el-divider>
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>{{ item.subTitle }}</span>
                <span>{{ item.subValue }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </el-skeleton>
  </div>
  <Navs></Navs>
</template>
<script setup>
import { ref } from 'vue'
import CountTo from '../components/CountTo.vue';
import Navs from '../components/Navs.vue'
import { getStatistics1 } from "@/api/index"
const panels = ref([])
getStatistics1().then(res => {
  panels.value = res.panels
  loading.value = false
})

const loading = ref(true)

</script>
