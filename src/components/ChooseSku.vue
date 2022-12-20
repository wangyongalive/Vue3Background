<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height:65vh;">
      <el-aside width="220px" class="choose-aside">
        <div class="top" v-loading="loading">
          <!-- 渲染列表 -->
          <div class="sku-list" :class="{ 'active': activeId == item.id }" v-for="(item, index) in tableData"
            :key="index" @click.stop="handleChangeActiveId(item.id)">
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <!-- current-page 当前页数  @current-page 改变时触发 -->
          <el-pagination background layout="prev, next" :total="total" :page-size="limit" @current-change="getData"
            v-model:current-page="currentPage" />
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click.stop="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.stop="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue"
import {
  getSkusList
} from "~/api/skus"
import {
  useInitTable
} from "~/composables/useCommon"

const emits = defineEmits(['submit'])

const dialogVisible = ref(false)
// 当前激活的id
const activeId = ref(0)

// 显示main的列表
const list = ref([])

// 选中规格的信息
const form = reactive({
  list: [],
  name: ''
})


const {
  loading,
  currentPage,
  limit,
  total,
  tableData,
  getData } =
  useInitTable({
    getList: getSkusList, // 获取列表的接口
    onGetListSuccess: (res) => {
      tableData.value = res.list
      total.value = res.totalCount
      if (tableData.value.length > 0) {
        // getData获取数据后 默认选中第一个
        handleChangeActiveId(tableData.value[0].id)
      }
    }
  })

const handleChangeActiveId = (id) => {
  activeId.value = id;
  list.value = [];
  let item = tableData.value.find((o) => o.id === id)
  if (item) {
    form.list = []
    list.value = item.default.split(",")
    form.name = item.name
  }
}

const submit = () => {
  emits('submit', form)
  dialogVisible.value = false
}

const open = () => {
  getData(1)
  dialogVisible.value = true
}


// 向外暴露一个打开方法
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.choose-aside {
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
}

// 列表样式
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply flex items-center cursor-pointer p-3 text-sm text-gray-600;
}

// 列表悬浮和激活的样式
.sku-list:hover,
.active {
  @apply bg-blue-50;
}
</style>