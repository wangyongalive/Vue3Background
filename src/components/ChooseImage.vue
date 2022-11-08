<template>
  <div v-if="modelValue">
    <el-image :src="modelValue" fit="cover" class="w-[150px] h-[150px] rounded border mr-2"></el-image>
  </div>

  <div class="choose-image-btn" @click.stop="open">
    <el-icon :size="25">
      <Plus />
    </el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisble" width="80%" top="5vh">
    <!-- 布局容器 -->
    <el-container class="bg-white rounded" style="height:70vh">
      <el-header class="image-header">
        <el-button size="small" @click.stop="handleOpenCreate" type="primary">新增图片分类</el-button>
        <el-button size="small" @click.stop="handleOpenUpload" type="warning">点击上传</el-button>
      </el-header>
      <el-container>
        <!-- 兄弟组件 借助父组件进行通信 -->
        <image-aside ref="ImageAsideRef" @change="handleAsideChange"></image-aside>
        <image-main ref="ImageMainRef" openChoose @choose="handleChoose"></image-main>
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisble = false">取消</el-button>
        <el-button type="primary" @click.stop="submit">OK</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
// .vue 要加后缀
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'

const dialogVisble = ref(false)

const open = () => dialogVisble.value = true;


const close = () => dialogVisble.value = false;



const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)

// 点击上传
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

const props = defineProps({
  modelValue: [String, Array]
})
const emits = defineEmits(["update:modelValue"])

let urls = []
// 选中图片中的check
const handleChoose = (e) => {
  urls = e.map(o => o.url)
}

const submit = () => {
  if (urls.length) {
    emits("update:modelValue", urls[0])
  }
  close()
}
</script>

<style lang="scss" scoped>
.choose-image-btn {
  @apply flex justify-center items-center w-[150px] h-[150px] rounded border cursor-pointer hover: (bg-gray-100);
}
</style>