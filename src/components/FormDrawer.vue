<template>
  <el-drawer v-model="showDrawer" :close-on-click-modal="false" :title="title" :size="size"
    :destroy-on-close="destroyOnClose">
    <div class="formDrawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="actions">
        <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>

</template>
<script setup>
import { ref } from "vue";

// props
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: "45%"
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: "提交"
  }
})

// emit 提交
const emit = defineEmits(["submit"])
const submit = () => emit("submit")


// 按钮状态
const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

// 抽屉打开/关闭
const showDrawer = ref(false);
const open = () => showDrawer.value = true;
const close = () => showDrawer.value = false;

// 向父组件暴露以下方法
defineExpose({
  open,
  close,
  showLoading,
  hideLoading
});
</script>
<style scoped>
.formDrawer {
  @apply flex flex-col w-full h-full;
}

/* body占满剩余空间 */
.formDrawer .body {
  flex: 1;
}

/* height占50% */
.formDrawer .actions {
  height: 50px;
  /* @apply mt-auto  */
}
</style>