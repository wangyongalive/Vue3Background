<template>
  <div v-if="modelValue && preview">
    <el-image v-if="typeof modelValue === 'string'" :src="modelValue" fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"></el-image>
    <div v-else class="flex flex-wrap h-[100px]">
      <div class="relative w-[100px] h-[100px] mx-1 mb-2" v-for="(url, index) in modelValue" :key="url + index">
        <el-icon class="absolute right-[5px] top-[5px] z-10 cursor-pointer bg-white rounded-full"
          @click.stop="removeImage(url)">
          <CircleClose />
        </el-icon>
        <el-image :src="url" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
      </div>
    </div>
  </div>

  <div v-if="preview" class="choose-image-btn" @click.stop="open">
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
        <image-main :limit="limit" ref="ImageMainRef" openChoose @choose="handleChoose"></image-main>
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
import { toast } from "~/composables/util";


const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1
  },
  preview: { // 预览 是否显示 +  添加的图片
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(["update:modelValue"])



const dialogVisble = ref(false)
const callbackFunction = ref(null); // 提交时的回调函数
const open = (callback = null) => {
  callbackFunction.value = callback
  dialogVisble.value = true
};
const close = () => dialogVisble.value = false;


const ImageAsideRef = ref(null)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id) => ImageMainRef.value.loadData(image_class_id)

// 点击上传
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()



let urls = []
// 选中图片中的check
const handleChoose = (e) => {
  urls = e.map(o => o.url)
}

// 提交前校验
const submit = () => {
  let value = []
  if (props.limit == 1) {
    value = urls[0]
  } else {
    // props.modelValue 传递的图片 
    value = props.preview ? [...props.modelValue, ...urls] : [...urls]
    if (value.length > props.limit) {
      let limit = props.preview ? (props.limit - props.modelValue.length) : props.limit
      return toast("最多还能选择" + limit + "张")
    }
  }
  if (value && props.preview) {
    emits("update:modelValue", value)
  }
  if (!props.preview && typeof callbackFunction.value === 'function') {
    callbackFunction.value(value)
  }
  close()
}


// 删除图片
const removeImage = (url) =>
  emits("update:modelValue", props.modelValue.filter(u => u != url))



defineExpose({
  open
})

</script>

<style lang="scss" scoped>
.choose-image-btn {
  @apply flex justify-center items-center w-[100px] h-[100px] rounded border cursor-pointer hover: (bg-gray-100);
}
</style>