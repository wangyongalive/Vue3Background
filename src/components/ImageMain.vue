<!-- 图片列表main -->
<template>
  <el-main class="image-main" v-loading="loading">
    <!-- 页面编写技巧：写多个标签模拟大量数据的情况 -->
    <div class="top p-3">
      <!-- <div v-for="i in list" :key="i">{{ i }}</div>
       -->
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
          <!-- border-blue-500 动态类 -->
          <el-card shadow="always" :body-style="{ padding: '0' }" class="relative mb-3"
            :class="{ 'border-blue-500': item.checkd }">
            <!-- card body -->
            <!-- :initial-index="0"
            :preview-src-list="[item.url]"
            图片预览 -->
            <el-image :src="item.url" fit="fill" :lazy="true" class="h-[150px] w-full" :initial-index="0"
              :preview-src-list="[item.url]">
            </el-image>
            <!-- 文字相对定位 -->
            <div class="image-title">{{ item.name }}</div>
            <div class="flex justify-center items-center p-2">
              <el-checkbox v-if="openChoose" v-model="item.checkd" @change="handleChoseChange(item)">
              </el-checkbox>
              <el-button type="primary" size="small" text @click.stop="handleEdit(item)">
                重命名
              </el-button>
              <el-popconfirm title="是否删除该图片?" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="handleDelete(item.id)">
                <template #reference>
                  <!-- !==!import -->
                  <el-button class="!m-0" type="primary" size="small" text>
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>

        </el-col>
      </el-row>

    </div>
    <div class="bottom">
      <!-- current-page 当前页数  @current-page 改变时触发 -->
      <el-pagination background layout="prev,pager, next" :total="total" :page-size="limit" @current-change="getData"
        v-model:current-page="currentPage" />
    </div>
  </el-main>

  <!-- ImageMain中的抽屉  没有用到提交功能 直接使用最简单的-->
  <el-drawer v-model="drawer" title="上传图片">
    <!-- data参数 success 上传成功的回调函数-->
    <upload-file :data="{ image_class_id }" @success="handleUploadSuccess"></upload-file>
  </el-drawer>

</template>

<script setup>
import { computed, ref } from "vue";
import UploadFile from '@/components/UploadFile.vue'
import {
  getImageList, updateImage,
  deleteImage
} from "@/api/image.js";
import { showPrompt, toast } from '@/composables/util.js'


const emit = defineEmits(['choose'])

// 是否显示check 默认不显示
const props = defineProps({
  openChoose: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 1
  }
})


// 上传图片抽屉
const drawer = ref(false)
// 打开抽屉 导出供外部使用
const openUploadFile = () => drawer.value = true


// 加载动画
const loading = ref(false);
const list = ref([]);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const image_class_id = ref(0);

// 获取数据 参数赋予默认值
function getData(limit = currentPage.value, id = image_class_id.value) {
  // currentPage.value = limit;
  loading.value = true; // 开始加载动画
  getImageList(id, limit)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list.map(o => {
        o.checkd = false;
        return o
      })
    })
    .finally(() => {
      loading.value = false; // 无论失败还是成功 都关闭动画
    });
}

// 根据分类ID重新加载图片列表
const loadData = (id) => {
  currentPage.value = 1;
  image_class_id.value = id;
  getData(1, id);
};


// 重命名
const handleEdit = (item) => {
  showPrompt('重命名', item.name).then(({ value }) => {
    // 解构value的值
    loading.value = true
    updateImage(item.id, value).then(res => {
      toast("修改成功")
      getData()
    }).finally()
    loading.value = false
  })
}

//  删除 
const handleDelete = (id) => {
  loading.value = true;
  deleteImage([id]).then((res) => {
    toast("删除成功")
    getData()
  }).finally(() => {
    loading.value = false;
  })
}

// 上传成功
const handleUploadSuccess = () => getData()




// 过滤出选中图片
const checkedImage = computed(() => {
  return list.value.filter(o => o.checkd)
})

// 是否选中图片
const handleChoseChange = (item) => {
  if (item.checkd && checkedImage.value.length > props.limit) {
    item.checkd = false; // 状态改回未选中 
    return toast(`最多只能选中${props.limit}张`, "error")
  }
  // emit 已经选中的图片
  emit('choose', checkedImage.value)
}


defineExpose({
  loadData,
  openUploadFile
});
</script>

<style lang="scss" scoped>
.image-main {
  border-right: 1px solid #eee;
  position: relative;

  .top {
    position: absolute;
    /*aside的overflow:auto 会产生进度条*/
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    /*top标签超出 在top标签内部产生滚动条 而不是aside*/
  }

  .bottom {
    // bottom: 0;
    // height: 50px;
    // left: 0;
    /* left:0;  right:0; 可以使内容撑开*/
    // right: 0;
    @apply flex items-center justify-center absolute bottom-0 left-0 right-0 h-50px;
  }

  .image-title {
    @apply absolute top-122px left-[-1px] right-[-1px] text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
  }
}
</style>