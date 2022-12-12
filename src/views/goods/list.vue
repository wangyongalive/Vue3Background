<template>
  <div>
    <!-- @tab-change  activeName 改变时触发 -->
    <el-tabs v-model="searchForm.tab" @tab-change="getData(1)">
      <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars" ::key="index"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="y-table border-0">
      <!-- 搜索  small:表单中的所有子组件都继承了该表单的 size 属性-->
      <el-form :model="searchForm" ref="searchFormRef" :rules="rules" label-width="80px" inline size="small">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="关键词">
              <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="0" v-if="showSearch">
            <el-form-item label="关键词" prop="category_id">
              <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 动态设置offset-->
          <el-col :span="8" :offset="showSearch ? 0 : 8">
            <div class="flex items-center justify-end">
              <el-button type="primary" @click="getData(1)">搜索</el-button>
              <el-button @click="restSearchForm">重置</el-button>
              <el-button type="primary" size="default" @click="showSearch = !showSearch" text>
                {{ showSearch ? '收起' : '展开' }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                  <ArrowDown v-else />
              </el-icon>
              </el-button>
            </div>
          </el-col>
        </el-row>

      </el-form>

      <!-- 新增和刷新 -->
      <header-list @create="handleCreate" @reFresh="handleReresh" />

      <div class="container">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading" height="100%">
          <el-table-column label="管理员" width="300" align="center">
            <!-- 需要用到插槽 table中的prop就不需要了 -->
            <template v-slot="{ row }">
              <div class="flex items-center">
                <el-image :src="row.cover" fit="cover" :lazy="true" style="width: 50px;height: 50px;"
                  class="mr-2"></el-image>
                <div class="flex-1 text-left">
                  <div>{{ row.title }}</div>
                  <div>
                    <span class="text-rose-500">{{ row.min_price }}</span>
                    <el-divider direction="vertical" />
                    <span class="text-gray-500 text-xs">{{ row.min_oprice }}</span>
                  </div>
                  <p class="text-xs mb-1 text-gray-400">分类：{{ row?.category?.name || '未分类' }}</p>
                  <p class="text-xs text-gray-400">创建时间：{{ row.create_time }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="实际销量" width="100" prop="sale_count" align="center">
          </el-table-column>
          <el-table-column label="商品状态" width="120">
            <!-- 解构 -->
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '上架' : '仓库' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab !== 'delete'">
            <!-- 解构 -->
            <template #default="{ row }">
              <div v-if="row.ischeck == 0">
                <el-button type="success" size="small" plain>审核通过</el-button>
                <!-- !ml-0 !important -->
                <el-button class="mt-2 !ml-0" type="danger" size="small" plain>审核拒绝</el-button>
              </div>
              <span v-else>
                {{ row.ischeck == 1 ? '通过' : '拒绝' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="总库存" width="90" prop="stock" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div v-if="searchForm.tab !== 'delete'">
                <el-button class="px-0" type="primary" size="default" text>修改</el-button>
                <el-button class="px-0" type="primary" size="default" text>商品规格</el-button>
                <el-button class="px-0" type="primary" size="default" text>设置轮播图</el-button>
                <el-button class="px-0" type="primary" size="default" text>商品详情</el-button>
                <el-popconfirm title="是否删除该商品?" confirm-button-text="确认" cancel-button-text="取消"
                  @confirm="hanleDelete(scope.row.id)">
                  <template #reference>
                    <el-button text type="primary">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
              <span v-else> 暂无操作</span>
            </template>
          </el-table-column>
        </el-table>
      </div>


      <div class="flex justify-center mt-5">
        <!-- current-page 当前页数  @current-page current-page改变时触发 -->
        <el-pagination background layout="prev, pager,next" :total="total" :page-size="limit" @current-change="getData"
          v-model:current-page="currentPage" />
      </div>


      <form-drawer ref="formDrawerRef" :title="drawTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <!-- <el-input v-model="form.avatar" placeholder="头像"></el-input> -->
            <!-- 头像组件 -->
            <!-- 组件中国的v-model -->
            <choose-image v-model="form.avatar"></choose-image>
          </el-form-item>
          <el-form-item label="所属管理员" prop="role_id">
            <el-select v-model="form.role_id" placeholder="请选择所属管理员">
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-form>
      </form-drawer>

    </el-card>
  </div>

</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "../../components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import HeaderList from "@/components/HeaderList.vue";
import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods
} from "~/api/goods"
import {
  getCategoryList
} from "~/api/category"
import { useInitTable, useInitForm } from "@/composables/useCommon";

// 抽离 列表分页和搜索
const {
  searchForm,
  restSearchForm,
  loading,
  tableData,
  currentPage,
  total,
  limit,
  getData,
  hanleDelete,
  handleStatusChange
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    total.value = res.totalCount;
    tableData.value = res.list.map((o) => {
      o.statusLoading = false; // switch 默认没有动画
      return o;
    });
    roles.value = res.roles;
  },
  updateStatus: updateGoodsStatus,
  delete: deleteGoods
})


const {
  editId,
  drawTitle,
  formDrawerRef,
  formRef,
  form,
  rules,
  resetForm,
  handleCreate,
  hanleEdit,
  handleSubmit,
  handleReresh } = useInitForm({
    form: {
      username: "",
      password: "",
      role_id: null,
      status: 1,
      avatar: ""
    },
    getData,
    update: updateGoods,
    create: createGoods
  })



// tab标签页
const tabbars = [{
  key: "all",
  name: "全部"
}, {
  key: "checking",
  name: "审核中"
}, {
  key: "saling",
  name: "出售中"
}, {
  key: "off",
  name: "已下架"
}, {
  key: "min_stock",
  name: "库存预警"
}, {
  key: "delete",
  name: "回收站"
}]


// 商品分类
const category_list = ref([])
getCategoryList().then(res => category_list.value = res)

const showSearch = ref(false);
</script>

<style lang="scss" scoped>
.y-table {
  height: calc(100vh - 200px);

  :deep(.el-card__body) {
    height: 100%;
  }

  .container {
    height: calc(100% - 140px);
  }
}
</style>