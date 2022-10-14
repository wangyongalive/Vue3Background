<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* 修改进度条的颜色 */
#nprogress .bar{
  background: #f4f4f4 !important;
  height: 3px !important;

}
</style>
