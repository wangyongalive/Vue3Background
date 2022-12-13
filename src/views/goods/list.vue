<template>
  <div>
    <!-- @tab-change  activeName 改变时触发 -->
    <el-tabs v-model="searchForm.tab" @tab-change="getData(1)">
      <el-tab-pane :label="item.name" :name="item.key" v-for="(item, index) in tabbars" ::key="index"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="y-table border-0">

      <search @search="getData(1)" @reset="restSearchForm">
        <!-- 默认插槽 -->
        <search-item label="关键词">
          <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
        </search-item>
        <!-- 高级搜索插槽 -->
        <template #show>
          <search-item label="商品名称">
            <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </search-item>
        </template>
      </search>

      <!-- 新增和刷新 -->
      <header-list layout="create,delete,reFresh" @create="handleCreate" @reFresh="handleReresh"
        @delete="handleMultiDelete">
        <el-button size="small" @click="handleMultiStatusChange(1)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'">上架</el-button>
        <el-button size="small" @click="handleMultiStatusChange(0)"
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'">下架</el-button>

      </header-list>

      <div class="container">
        <el-table ref="multipleTableRef" @selection-change="handleSelectionChange" :data="tableData" stripe
          style="width: 100%" v-loading="loading" height="100%">
          <el-table-column type="selection" width="55" />
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
                <el-button class="px-0" type="primary" size="default" text
                  @click.stop="hanleEdit(scope.row)">修改</el-button>
                <el-button class="px-0" type="primary" size="default" text>商品规格</el-button>
                <el-button class="px-0" size="default" text @click.stop="handleSetGoodsBanners(scope.row)"
                  :type="scope.row.goods_banner.length == 0 ? 'danger' : 'primary'"
                  :loading="scope.row.bannersLoading">设置轮播图</el-button>
                <el-button class="px-0" :type="!scope.row.content ? 'danger' : 'primary'" size="default" text
                  @click.stop="handleSetGoodsContent(scope.row)" :loading="scope.row.contentLoading">商品详情</el-button>
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
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"></el-input>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover" />
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="选择所属商品分类">
              <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input type="textarea" v-model="form.desc" placeholder="选填，商品卖点"></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input v-model="form.unit" placeholder="请输入单位" style="width:50%;"></el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width:40%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width:40%;">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width:40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice" type="number" style="width:40%;">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </form-drawer>

      <!-- getData() 不使用reloadData传递的参数 -->
      <banners ref="bannersRef" @reloadData="getData()"></banners>

      <content ref="contentRef" @reloadData="getData()"></content>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "../../components/FormDrawer.vue";
import ChooseImage from "@/components/ChooseImage.vue";
import HeaderList from "@/components/HeaderList.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import banners from "./banners.vue";
import content from "./content.vue";

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
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
  handleMultiStatusChange
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
      o.bannersLoading = false; // 轮播图 默认没有动画
      o.contentLoading = false; // 商品详情 默认没有动画
      return o;
    });
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
      title: null, //商品名称
      category_id: null, //商品分类
      cover: null, //商品封面
      desc: null, //商品描述
      unit: "件", //商品单位
      stock: 100, //总库存
      min_stock: 10, //库存预警
      status: 1, //是否上架 0仓库1上架
      stock_display: 1, //库存显示 0隐藏1显示
      min_price: 0, //最低销售价
      min_oprice: 0 //最低原价
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

// 设置轮播图
const bannersRef = ref(null)
const handleSetGoodsBanners = (row) => bannersRef.value.open(row)

// 设置商品
const contentRef = ref(null)
const handleSetGoodsContent = (row) => contentRef.value.open(row)

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