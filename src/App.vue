<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
body {
  @apply bg-gray-100;
}

/* 修改进度条的颜色 */
#nprogress .bar {
  background: #f4f4f4 !important;
  height: 3px !important;

}

/* 全局滚动条 */
::-webkit-scrollbar {
  width: 10px;
  /*纵向滚动条*/
  height: 6px;
  /*横向滚动条*/
}

::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
}

/* track 滚动条轨道*/
/* thumb 滚动条滑块 */
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, .1);
}
</style>
