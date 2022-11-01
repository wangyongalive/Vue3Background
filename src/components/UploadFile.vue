<template>
  <!-- 这里的上传文件 不是使用api 参数通过prop传入 -->
  <el-upload drag :action="uploadImageAction" multiple :headers="{
    token
  }" name="img" :data="data" :on-success="handleSuccess" :on-error="handleError">
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { toast } from '@/composables/util.js'
// 导入后端图片上传地址
import { uploadImageAction } from "@/api/image.js"
import { getToken } from '@/composables/auth'
const token = getToken()

defineProps({
  data: Object
})

const emit = defineEmits(["success"])


const handleSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", {
    response, uploadFile, uploadFiles
  })
}

const handleError = (error, uploadFile, uploadFiles) => {
  let msg = JSON.parse(error.message).msg || "上传失败"
  toast(msg, 'error')
}
</script>
